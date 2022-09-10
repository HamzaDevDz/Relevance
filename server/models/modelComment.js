import mongoose from 'mongoose'
import {ObjectId} from "mongodb";

const commentSchema = new mongoose.Schema({
    idPost: {
        required: [true, 'Provide an idPost'],
        type: ObjectId,
    },
    idUser: {
        required: [true, 'Provide an idUser'],
        type: ObjectId,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
    content: {
        required: [true, 'Please enter a comment'],
        type: String,
    },
    likes: [String],
    dislikes: [String],
});

export default mongoose.models.comments || mongoose.model('comments', commentSchema);