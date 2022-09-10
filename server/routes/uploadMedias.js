import upload from "../middlewares/upload.js";
import express from "express";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import {statusCode} from "../config.js";
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

router.post("/upload", upload.single("file"), async (req, res, next) => {
    if (req.file === undefined) return next({message: "File must be selected", status: statusCode.FORBIDDEN});
    return res.send(req.file.filename).status(200)
});

router.get("/retrieve", async (req, res, next) => {
    try {
        const file = await gfs.files.findOne({ filename: req.query.filename });
        if(!file) return next({message: "There's no image found", code: statusCode.NOTFOUND});
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        next({message: "Error while retrieving the file", code: statusCode.NOTFOUND});
    }
})


router.delete("/delete/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});

export default router
