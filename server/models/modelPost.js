import mongoose from 'mongoose'
import {ObjectId} from "mongodb";

const postSchema = new mongoose.Schema({
    idUser: ObjectId,
    timestamp: {
        type: Date,
        default: Date.now(),
    },
    status: String,
    urlImg: String,
    likes:[String],
    dislikes:[String],
});

export default mongoose.models.posts || mongoose.model('posts', postSchema);