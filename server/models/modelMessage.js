import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';

const messageSchema = new mongoose.Schema({
    idWindow: ObjectId,
    content: String,
    timestamp: {type: Date, default: Date.now()},
    idUser: ObjectId,
    like:[ObjectId],
    dislikes:[ObjectId]
});

export default mongoose.models.messages || mongoose.model('messages', messageSchema);