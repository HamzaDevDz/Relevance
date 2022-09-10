import modelMessage from "../models/modelMessage.js";
import {ObjectId} from "mongodb";

function SocketMessage(io, socket) {
    socket.on('addMessage', async ({idWindow, idMessage}) => {
        const newMessage = await modelMessage.aggregate([
            {
                $match: {_id: ObjectId(idMessage)}
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
        ]);
        io.emit('addMessage', {newMessage: newMessage[0]});
        io.emit('checkLastSeenIdMessages', {idWindow : newMessage[0]?.idWindow});
        io.emit('checkNumberMissedDiscussions')
    });
    socket.on('deleteMessage', ({idWindow, idMessage}) => {
        io.emit('deleteMessage', {idWindow, idMessage});
        io.emit('checkLastSeenIdMessages', {idWindow : idWindow});
        io.emit('checkNumberMissedDiscussions')
    });
    socket.on('uploadMoreMessages', async ({idWindow, skip, limit, idUser}) => {
        const moreMessages = await modelMessage.aggregate([
            {
                $match: {idWindow: ObjectId(idWindow)}
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
                $skip: parseInt(skip)
            },
            {
                $limit: parseInt(limit),
            },
        ]);
        io.to(idWindow).emit('uploadMoreMessages', {moreMessages, idWindow, idUser})
    })
}

export default SocketMessage;