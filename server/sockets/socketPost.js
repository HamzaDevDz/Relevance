import {ObjectId} from 'mongodb';
import modelPost from "../models/modelPost.js";

function SocketPost(io, socket) {
    socket.on('addPost', async ({idPost}) => {
        try{
            const response = await modelPost.aggregate([
                {
                    $match: {
                        _id: ObjectId(idPost)
                    }
                },
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
                }
            ])
            io.emit('addPost', response[0]);
        }catch (err) {
            console.log(err)
        }

    });
    socket.on('deletePost', ({idPost}) => {
        io.emit('deletePost', idPost);
    })
    socket.on('updateMetaDataPost', ({idPost}) => {
        console.log('Socket : updateMetaDataPost');
        console.log(idPost);
        io.emit('updateMetaDataPost', idPost);
    })
}

export default SocketPost;