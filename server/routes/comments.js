import express from "express";
import {ObjectId} from "mongodb";
import modelComment from "../models/modelComment.js";

const router = express.Router();

router.get('/getComments/:idPost', async (req, res, next) => {
    try{
        const comments = await modelComment.aggregate([
            {
                $match: {idPost: ObjectId(req.params.idPost)}
            },
            {
                $lookup:{
                    from: "users",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $project:{
                    '_id': 1,
                    'timestamp': 1,
                    'content': 1,
                    'idUser': 1,
                    'firstName': {$arrayElemAt: ['$users.firstName', 0]},
                    'lastName': {$arrayElemAt: ['$users.lastName', 0]},
                    'urlImgUser': {$arrayElemAt: ['$users.urlImg', 0]},
                }
            },
            {
                $sort: {
                    'timestamp': -1
                }
            }
        ])
        // console.log(comments)
        res.status(200).json(comments);
    }catch(err){
        next(err);
    }
});

router.post('/addComment', async (req, res, next) => {
    try{
        const newComment = {
            idUser: ObjectId(req.body.idUser),
            idPost: ObjectId(req.body.idPost),
            content: req.body.content,
            likes: [],
            dislikes: [],
        }
        await modelComment.create(newComment);
        res.json({idPost: req.body.idPost}).status(200);
    }catch(err){
        next(err);
    }
});

router.delete('/deleteComment/:idComment', async (req, res) => {
    await modelComment.deleteOne({_id: req.params.idComment});
    res.json({idComment: req.params.idComment}).status(200);
});

router.get('/getMetaDataComment/:idComment/:idUser', async (req, res) => {
    const response = await modelComment.aggregate([
        {
            $match: {_id: ObjectId.createFromHexString(req.params.idComment)}
        },
        {
            $project: {
                'nbrLikesComment': {$size: '$likes'},
                'nbrDislikesComment': {$size: '$dislikes'},
                'flagLikeComment': {$in: [req.params.idUser, '$likes']},
                'flagDislikeComment': {$in: [req.params.idUser, '$dislikes']}
            }
        }
    ])
    res.json(response[0]).status(200);
});

router.put('/setLikeComment/:idComment', async (req, res) => {
    const response = await modelComment.findOne({_id: req.params.idComment, 'likes': {$in : req.body.idUser}});
    if(!response) await modelComment.findOneAndUpdate(
        {'_id': req.params.idComment},
        {
            $push: {'likes': req.body.idUser}
        }
    )
    else await modelComment.findOneAndUpdate(
        {'_id': req.params.idComment},
        {
            $pull: {'likes': {$in: req.body.idUser}}
        }
    )
    res.status(200).json({idComment: req.params.idComment});
});

router.put('/setDislikeComment/:idComment', async (req, res) => {
    const response = await modelComment.findOne({_id: req.params.idComment, 'dislikes': {$in : req.body.idUser}});
    if(!response) await modelComment.findOneAndUpdate(
        {'_id': req.params.idComment},
        {
            $push: {'dislikes': req.body.idUser}
        }
    )
    else await modelComment.findOneAndUpdate(
        {'_id': req.params.idComment},
        {
            $pull: {'dislikes': {$in: req.body.idUser}}
        }
    )
    res.status(200).json({idComment: req.params.idComment});
});


export default router;