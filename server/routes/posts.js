import express from "express";
import {ObjectId} from 'mongodb';
import modelPost from "../models/modelPost.js";
import upload from "../middlewares/upload.js";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import modelComment from "../models/modelComment.js";

const router = express.Router();

const conn = mongoose.connection;
let gfs, gridfsBucket;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'medias'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('medias');
});

router.post('/addPost', upload.single("file"), async (req, res, next) => {
    try{
        const newPost = {
            idUser: ObjectId(req.body.idUser),
            timestamp: Date.now(),
            status: req.body.status,
            urlImg: req.file ? req.file.filename : "",
            likes: [],
            dislikes: [],
        }
        const response = await modelPost.create(newPost);
        res.json({idPost: response._id}).status(200);
    }catch(err){
        console.log("error addPost :");
        console.log(err)
        next(err);
    }
});

router.get('/getPosts/:limit', async (req, res, next) => {
    try{
        const posts = await modelPost.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "timestamp": 1,
                    "status": 1,
                    "urlImg": 1,
                    "idUser": {$arrayElemAt: ["$user._id", 0]},
                    "urlImgUser": {$arrayElemAt: ["$user.urlImg", 0]},
                    "firstName": {$arrayElemAt: ["$user.firstName", 0]},
                    "lastName": {$arrayElemAt: ["$user.lastName", 0]},
                }
            },
            {
                $sort: {
                    timestamp: -1
                }
            },
            {
                $limit: parseInt(req.params.limit)
            }
        ]);
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.post('/getMorePosts', async (req, res, next) => {
    console.log('Get More Posts');
    try{
        const posts = await modelPost.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: {
                    "_id": 1,
                    "timestamp": 1,
                    "status": 1,
                    "urlImg": 1,
                    "idUser": {$arrayElemAt: ["$user._id", 0]},
                    "urlImgUser": {$arrayElemAt: ["$user.urlImg", 0]},
                    "firstName": {$arrayElemAt: ["$user.firstName", 0]},
                    "lastName": {$arrayElemAt: ["$user.lastName", 0]},
                }
            },
            {
                $sort: {
                    "timestamp": -1
                }
            },
            {
                $skip: parseInt(req.body.skip)
            },
            {
                $limit: parseInt(req.body.limit)
            },
        ]);
        res.status(200).json(posts);
    } catch (err) {
        console.log("error getAll Posts :");
        console.log(err);
        next(err);
    }
});

router.get('/getThereAreMorePosts/:skip', async (req, res, next) => {
    try{
        const countDocuments = await modelPost.countDocuments()
        res.status(200).send(countDocuments - req.params.skip > 0);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.delete('/deletePost/:idPost', async (req, res) => {
    const post = await modelPost.findOne({id: req.params.idPost});
    await gfs.files.deleteOne({ filename: post.urlImg });
    await modelComment.deleteMany({idPost: req.params.idPost});
    await modelPost.deleteOne({_id: req.params.idPost});
    res.json({idPost: req.params.idPost}).status(200);
});

router.put('/setLikePost/:idPost', async (req, res) => {
    const response = await modelPost.findOne({_id: req.params.idPost, 'likes': {$in : req.body.idUser}});
    if(!response) await modelPost.findOneAndUpdate(
        {'_id': req.params.idPost},
        {
            $push: {'likes': req.body.idUser}
        }
    )
    else await modelPost.findOneAndUpdate(
        {'_id': req.params.idPost},
        {
            $pull: {'likes': {$in: req.body.idUser}}
        }
    )
    res.status(200).json({idPost: req.params.idPost});
});

router.put('/setDislikePost/:idPost', async (req, res) => {
    const response = await modelPost.findOne({_id: req.params.idPost, 'dislikes': {$in : req.body.idUser}});
    if(!response) await modelPost.findOneAndUpdate(
        {'_id': req.params.idPost},
        {
            $push: {'dislikes': req.body.idUser}
        }
    )
    else await modelPost.findOneAndUpdate(
        {'_id': req.params.idPost},
        {
            $pull: {'dislikes': {$in: req.body.idUser}}
        }
    )
    res.status(200).json({idPost: req.params.idPost});
});

router.get('/getMetaDataPost/:idPost/:idUser', async (req, res) => {
    const response = await modelPost.aggregate([
        {
            $match: {_id: ObjectId(req.params.idPost)}
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "idPost",
                as: "comments"
            }
        },
        {
            $project: {
                "nbrComments": {$size: "$comments"},
                "nbrLikes": {$size: "$likes"},
                "nbrDislikes": {$size: "$dislikes"},
                "flagLike": {$in: [req.params.idUser, "$likes"]},
                "flagDislike": {$in: [req.params.idUser, "$dislikes"]},
            }
        }
    ]);
    res.status(200).json(response[0]);
});

router.get('/getMyPosts/:idUser/:limit', async (req, res, next) => {
    try{
        const posts = await modelPost.aggregate([
            {
                $match: {
                    idUser: ObjectId(req.params.idUser)
                }
            },
            {
                $project: {
                    "_id": 1,
                    "timestamp": 1,
                    "status": 1,
                    "urlImg": 1,
                }
            },
            {
                $sort: {
                    timestamp: -1
                }
            },
            {
                $limit: parseInt(req.params.limit)
            },
        ]);
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

export default router;