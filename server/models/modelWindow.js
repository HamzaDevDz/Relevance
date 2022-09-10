import mongoose from 'mongoose';
import {ObjectId} from 'mongodb';

const windowSchema = new mongoose.Schema({
    timestamp: {type: Date, default: Date.now()},
    idUsers: [{idUser:ObjectId, open: Boolean, lastSeenIdMessage: String}],
});

export default mongoose.models.windows || mongoose.model('windows', windowSchema);