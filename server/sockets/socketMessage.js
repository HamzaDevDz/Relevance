import modelMessage from "../models/modelMessage.js";
import {ObjectId} from "mongodb";
import modelWindow from "../models/modelWindow.js";

function SocketMessage(io, socket) {
    socket.on('addMessage', async ({idMessage, idUser}) => {
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
        io.emit('checkMissedMessages', {idWindow : newMessage[0]?.idWindow});
    });
    socket.on('deleteMessage', ({idWindow, idMessage}) => {
        io.emit('deleteMessage', {idWindow, idMessage});
        io.emit('checkMissedMessages', {idWindow : idWindow});
    });
    socket.on('checkMissedMessages', ({idWindow}) => {
        io.emit('checkMissedMessages', {idWindow : idWindow});
    })
}

export default SocketMessage;