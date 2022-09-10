import express from "express";
import {ObjectId} from 'mongodb';
import modelUser from "../models/modelUser.js";
import {fieldsName, statusCode} from "../config.js";
import bcrypt from "bcryptjs";
import upload from "../middlewares/upload.js";
import mongoose from "mongoose";
import Grid from "gridfs-stream";

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

router.post('/signup', upload.single("file"), async (req, res, next) => {
    if (req.file === undefined) return next({message: "Image must be selected", status: statusCode.FORBIDDEN});
    try{
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            urlImg: req.file.filename
        }
        const response = await modelUser.create(newUser);
        delete response.password;
        res.json(response).status(200);
    }catch(err){
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try{

        const user = await modelUser.aggregate([{$match: {username: String(req.body.username).toLowerCase()}}]);

        if(user.length === 0) return next({field: fieldsName.USERNAME, code: statusCode.NOTFOUND});
        if(!bcrypt.compareSync(req.body.password, user[0].password)) return next({field: fieldsName.PASSWORD, code: statusCode.UNAUTHORIZED});

        delete user[0].password;
        res.status(200).json(user[0]);

    } catch (err) {
        next(err);
    }
});

router.post('/search', async (req, res, next) => {
    try{
        const keywords = String(req.body.name).split(' ');
        let results = [];
        for (const keyword of keywords) {
            const Value_match = new RegExp('^'+keyword,'i');
            const users = await modelUser.aggregate([
                {
                    $match: {
                        $or: [
                            {firstName: {$regex: Value_match}},
                            {lastName: {$regex: Value_match}},
                            {username: {$regex: Value_match}}
                        ],
                        _id: {$ne: ObjectId(req.body.idUser)}
                    }
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        urlImg: 1,
                    }
                }
            ]);
            if(users){
                users.forEach(user => {
                    if(results.findIndex(u => u._id === user._id) === -1) results.push(user);
                })
            }
        }
        if(results.length === 0) res.status(404).json({message: "No user found !"});
        else res.status(200).json(results);
    } catch (err) {
        next(err);
    }
});

export default router;