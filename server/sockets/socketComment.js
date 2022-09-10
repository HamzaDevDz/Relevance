function SocketComment(io, socket) {
    socket.on('getComments', ({idPost}) => {
        io.emit('getComments', idPost);
        io.emit('updateMetaDataPost', idPost)
    });
    socket.on('updateMetaDataComment', ({idComment}) => {
        io.emit('updateMetaDataComment', idComment);
    })
}

export default SocketComment;