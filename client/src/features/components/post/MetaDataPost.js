import {ThumbDownIcon as ThumbDownIconSolid, ThumbUpIcon as ThumbUpIconSolid} from "@heroicons/react/solid";
import {
    ChatAltIcon,
    ThumbDownIcon as ThumbDownIconOutline,
    ThumbUpIcon as ThumbUpIconOutline
} from "@heroicons/react/outline";
import {useLazyGetMetaDataPostQuery, useSetDislikePostMutation, useSetLikePostMutation} from "../../api/postApi";
import {useEffect} from "react";
import Socket from "../../socket/Socket";
import {useSelector} from "react-redux";
import {selectUser} from "../../slices/userSlice";

function MetaDataPost({idPost}) {

    const user = useSelector(selectUser);

    const [triggerMetaDataPost, {currentData: metaDataPost}] = useLazyGetMetaDataPostQuery();
    const [setLikePost, resultSetLikePost] = useSetLikePostMutation();
    const [setDislikePost, resultSetDislikePost] = useSetDislikePostMutation();

    useEffect(() => {
        if(resultSetLikePost.isSuccess) Socket.emit('updateMetaDataPost', resultSetLikePost.data);
        if(resultSetDislikePost.isSuccess) Socket.emit('updateMetaDataPost', resultSetDislikePost.data);
    }, [resultSetLikePost.isSuccess, resultSetDislikePost.isSuccess])

    useEffect(() => {
        if(user && user?._id){
            triggerMetaDataPost({idPost, idUser: user?._id});
            Socket.on('updateMetaDataPost', (idPostSocket) => {
                if(idPostSocket === idPost) triggerMetaDataPost({idPost, idUser: user?._id});
            });
        }
    }, [user])

    return (
        <div className={"flex items-center w-full px-3 justify-evenly text-sm mb-3"}>
            <div className={"flex items-center space-x-5"}>
                <div className={`flex items-center space-x-2 hover:cursor-pointer rounded p-1 hover:bg-gray-200 ${resultSetLikePost.isLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}
                     onClick={() => setLikePost({idPost: idPost, idUser: user?._id})}
                >
                    {metaDataPost?.flagLike ? <ThumbUpIconSolid className={"h-6 text-red-600"} /> : <ThumbUpIconOutline className={"h-6 text-red-600"} />}
                    <p>{metaDataPost?.nbrLikes ? metaDataPost?.nbrLikes : 0}</p>
                </div>
                <div className={`flex items-center space-x-2 hover:cursor-pointer rounded p-1 hover:bg-gray-200 ${resultSetDislikePost.isLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}
                     onClick={() => setDislikePost({idPost: idPost, idUser: user?._id})}
                >
                    {metaDataPost?.flagDislike ? <ThumbDownIconSolid className={"h-6 text-gray-600"} /> : <ThumbDownIconOutline className={"h-6 text-gray-600"} />}
                    <p>{metaDataPost?.nbrDislikes ? metaDataPost?.nbrDislikes : 0}</p>
                </div>
            </div>
            <div className={"flex items-center space-x-2 hover:cursor-pointer rounded p-1 hover:bg-gray-200"}>
                <ChatAltIcon className={"h-6 text-gray-800"} />
                <p>{metaDataPost?.nbrComments ? metaDataPost?.nbrComments : 0}</p>
            </div>
        </div>
    )
}

export default MetaDataPost;