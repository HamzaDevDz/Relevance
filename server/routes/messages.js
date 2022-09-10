import express from "express";
import {ObjectId} from "mongodb";
import modelWindow from "../models/modelWindow.js";
import modelMessage from "../models/modelMessage.js";
import modelUser from "../models/modelUser.js";

const router = express.Router();

router.post('/openWindow', async (req, res, next) => {
    try{
        const window = await modelWindow.aggregate([
            {
                $project: {
                    '_id': 1,
                    'idUsers': 1,
                    'number_of_users': {$size: '$idUsers'}
                }
            },
            {
                $match: {
                    $and: [
                        {'idUsers.idUser' : ObjectId(req.body.idUser)},
                        {'idUsers.idUser' : ObjectId(req.body.idFriend)},
                        {'number_of_users' : {$eq: 2}}
                    ],
                }
            }
        ]);
        if(window.length === 0)
            await modelWindow.create(
                {
                    timestamp: Date.now(),
                    idUsers: [
                        {idUser: ObjectId(req.body.idUser), open: true, lastSeenIdMessage: ""},
                        {idUser: ObjectId(req.body.idFriend), open: false, lastSeenIdMessage: ""}
                        ]
                });
        res.status(200).json({idFriend: req.body.idFriend});
    }catch(err){
        next(err);
    }
});

router.get('/getWindows/:idUser', async (req, res, next) => {
    try{
        const windows = await modelWindow.aggregate([
            {
                $match: {
                    'idUsers': {
                        $elemMatch: {
                            'idUser': ObjectId(req.params.idUser),
                            'open': true
                        }
                    }
                }
            },
            {
                $sort: {
                    'timestamp': -1
                }
            }
        ])
        if(!windows || windows.length === 0) return res.status(404).json({message: "No Windows Opened"});
        let results = [];
        for (const window of windows) {
            const indexSelf = window.idUsers.findIndex(f => f.idUser.toString() === req.params.idUser);
            const indexFriend = window.idUsers.findIndex(f => f.idUser.toString() !== req.params.idUser);
            let windowFriend = await modelUser.aggregate([
                {$match: {_id: ObjectId(window.idUsers[indexFriend].idUser)}},
                {$project: {_id: 1, firstName: 1, lastName: 1, urlImg: 1}}
            ]);
            windowFriend[0]['idWindow'] = window._id.toString();
            const idLastMessage = await modelMessage.aggregate([
                {$match: {idWindow: window._id}},
                {$project: {_id: 1, timestamp: 1}},
                {$sort: {timestamp: -1}},
                {$limit: 1}
            ]);
            windowFriend[0]['seenLastMessage'] = idLastMessage.length === 0 ? true : window.idUsers[indexSelf].lastSeenIdMessage === idLastMessage[0]._id.toString();
            results.push(windowFriend[0]);
        }
        res.status(200).json(results);
    }catch(err){
        next(err);
    }
});

router.delete('/deleteWindow/:idWindow', async (req, res) => {
    await modelMessage.deleteMany({idWindow: ObjectId(req.params.idWindow)});
    await modelWindow.deleteOne({_id: ObjectId(req.params.idWindow)});
    res.json({idWindow: req.params.idWindow}).status(200);
});

router.post('/addMessage', async (req, res, next) => {
    try{
        const newMsg = {
            idWindow: ObjectId(req.body.idWindow),
            content: req.body.content,
            idUser: ObjectId(req.body.idUser),
            timestamp: Date.now(),
            likes: [],
            dislikes: []
        };
        const newMessage =  await modelMessage.create(newMsg);
        await modelWindow.updateOne(
            {
                _id: ObjectId(req.body.idWindow),
                'idUsers':{
                    $elemMatch: {
                        'open': false
                    }
                }
            },
            {
                $set: {
                    'idUsers.$.open': true,
                    'timestamp': Date.now()
                }
            }
        );
        await modelWindow.updateOne(
            {
                _id: ObjectId(req.body.idWindow),
                'idUsers':{
                    $elemMatch: {
                        'idUser': ObjectId(req.body.idUser)
                    }
                }
            },
            {
                $set: {'idUsers.$.lastSeenIdMessage': newMessage._id.toString()}
            }
        );
        res.json({idWindow: newMessage.idWindow, idMessage: newMessage._id}).status(200);
    }catch(err){
        next(err);
    }
});

router.post('/setLastSeenIdMessage', async (req, res, next) => {
    try{
        const idLastMessage = await modelMessage.aggregate([
            {$match: {idWindow: ObjectId(req.body.idWindow)}},
            {$project: {_id: 1, timestamp: 1}},
            {$sort: {timestamp: -1}},
            {$limit: 1}
        ]);
        await modelWindow.updateOne(
            {
                _id: ObjectId(req.body.idWindow),
                'idUsers':{
                    $elemMatch: {
                        'idUser': ObjectId(req.body.idUser)
                    }
                }
            },
            {
                $set: {'idUsers.$.lastSeenIdMessage': idLastMessage.length === 0 ? "" : idLastMessage[0]._id.toString()}
            }
        );
        res.send('success').status(200);
    }catch(err){
        next(err);
    }
});

router.delete('/deleteMessage/:idWindow/:idMessage', async (req, res) => {
    const deletedMsg = await modelMessage.findOne({_id: ObjectId(req.params.idMessage)});
    const window = await modelWindow.findOne({_id: ObjectId(req.params.idWindow)});
    for (const user of window.idUsers) {
        if (req.params.idMessage === user.lastSeenIdMessage) {
            const newIdLastMessage = await modelMessage.aggregate([
                {$match: {idWindow: ObjectId(window._id), timestamp: {$lt: deletedMsg.timestamp}}},
                {$project: {_id: 1, timestamp: 1}},
                {$sort: {timestamp: -1}},
                {$limit: 1}
            ]);
            await modelWindow.updateOne(
                {
                    _id: ObjectId(req.params.idWindow),
                    'idUsers': {
                        $elemMatch: {
                            'idUser': ObjectId(user.idUser)
                        }
                    }
                },
                {
                    $set: {'idUsers.$.lastSeenIdMessage': newIdLastMessage.length > 0 ? newIdLastMessage[0]._id.toString() : "", 'timestamp': Date.now()}
                }
            );
        }
    }
    await modelMessage.deleteOne({_id: ObjectId(req.params.idMessage)});
    res.json({idWindow: req.params.idWindow, idMessage: req.params.idMessage}).status(200);
});

router.get('/getMessages/:idWindow/:idUser/:limit', async (req, res, next) => {
    const messages = await modelMessage.aggregate([
        {
            $match: {idWindow: ObjectId(req.params.idWindow)}
        },
        {
            $lookup:{
                from: "users",
                localField: "idUser",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project:{
                _id: 1,
                idWindow: 1,
                content: 1,
                timestamp: 1,
                idUser: {$arrayElemAt: ["$user._id", 0]},
                urlImgUser: {$arrayElemAt: ["$user.urlImg", 0]},
                firstName: {$arrayElemAt: ["$user.firstName", 0]},
                lastName: {$arrayElemAt: ["$user.lastName", 0]},
            }
        },
        {
            $sort: {
                timestamp: -1
            }
        },
        {
            $limit: parseInt(req.params.limit),
        },
    ]);
    await modelWindow.updateOne(
        {
            _id: ObjectId(req.params.idWindow),
            'idUsers':{
                $elemMatch: {
                    'idUser': ObjectId(req.params.idUser)
                }
            }
        },
        {
            $set: {'idUsers.$.lastSeenIdMessage': messages.length > 0 ? messages[0]._id.toString() : ""}
        }
    );
    res.status(200).json(messages);
})

router.post('/uploadMoreMessages', async (req, res, next) => {
    const moreMessages = await modelMessage.aggregate([
        {
            $match: {idWindow: ObjectId(req.body.idWindow)}
        },
        {
            $lookup:{
                from: "users",
                localField: "idUser",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project:{
                _id: 1,
                idWindow: 1,
                content: 1,
                timestamp: 1,
                idUser: {$arrayElemAt: ["$user._id", 0]},
                urlImgUser: {$arrayElemAt: ["$user.urlImg", 0]},
                firstName: {$arrayElemAt: ["$user.firstName", 0]},
                lastName: {$arrayElemAt: ["$user.lastName", 0]},
            }
        },
        {
            $sort: {
                timestamp: -1
            }
        },
        {
            $skip: parseInt(req.body.skip)
        },
        {
            $limit: parseInt(req.body.limit)
        },
    ]);
    res.status(200).json(moreMessages);
})

router.get('/getThereAreMoreMessages/:skip', async (req, res, next) => {
    const messages = await modelMessage.aggregate([
        {
            $match: {idWindow: ObjectId(req.body.idWindow)}
        },
        {
            $skip: parseInt(req.params.skip)
        },
    ]);
    res.status(200).send(messages.length > 0);
});


export default router;