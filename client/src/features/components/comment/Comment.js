import calculateTime from "../../utils/calculateTimestamp";
import {ThumbUpIcon as ThumbUpIconSolid, ThumbDownIcon as ThumbDownIconSolid, XIcon} from "@heroicons/react/solid";
import {ThumbUpIcon as ThumbUpIconOutline, ThumbDownIcon as ThumbDownIconOutline} from "@heroicons/react/outline";
import Avatar from "../Avatar";
import {useSelector} from "react-redux";
import {selectUser} from "../../slices/userSlice";
import {
    useDeleteCommentMutation,
    useLazyGetMetaDataCommentQuery,
    useSetDislikeCommentMutation,
    useSetLikeCommentMutation
} from "../../api/commentApi";
import Loading from "../Loading";
import {useEffect} from "react";
import Socket from '../../socket/Socket';


function Comment ({idPost, idComment, idUser, firstName, lastName, urlImgUser, content, timestamp}) {

    const user = useSelector(selectUser);

    const [deleteComment, resultDeleteComment] = useDeleteCommentMutation();

    const [triggerMetaDataComment, {currentData: metaData}] = useLazyGetMetaDataCommentQuery();

    const [setLikeComment, resultSetLikeComment] = useSetLikeCommentMutation();
    const [setDislikeComment, resultSetDislikeComment] = useSetDislikeCommentMutation();

    useEffect(() => {
        if(resultDeleteComment.isSuccess) Socket.emit('getComments', {idPost})
    }, [resultDeleteComment.isSuccess]);

    useEffect(() => {
        if(resultSetLikeComment.isSuccess) Socket.emit('updateMetaDataComment', resultSetLikeComment.data);
        if(resultSetDislikeComment.isSuccess) Socket.emit('updateMetaDataComment', resultSetDislikeComment.data);
    }, [resultSetLikeComment.isSuccess, resultSetDislikeComment.isSuccess]);

    useEffect(() => {
        if(user){
            triggerMetaDataComment({idComment, idUser: user?._id});
            Socket.on('updateMetaDataComment', (idCommentSocket) => {
                if(idCommentSocket === idComment) triggerMetaDataComment({idComment, idUser: user?._id});
            })
        }
    }, [user]);

    return (
        <div className={"w-full mt-3 text-xs md:text-sm px-3 relative"}>
            {
                user?._id === idUser ?
                    resultDeleteComment.isLoading ?
                        <div className={"absolute top-0 left-0 w-full h-full bg-loading flex items-center justify-center"}>
                            <Loading className={"w-8 h-8 fill-blue-400 text-gray-200"} />
                        </div>
                        :
                        <div className={"p-1 rounded-full hover:cursor-pointer hover:bg-gray-200 absolute top-0 right-0 -translate-y-full"}
                             onClick={() => deleteComment({idComment})}
                        >
                            <XIcon className={"h-4 text-gray-400"} />
                        </div>
                    :
                    ''
            }
            <div className={"w-full flex items-center space-x-2 mb-2"}>
                <div className={"flex items-center space-x-2"}>
                    <Avatar srcImg={urlImgUser} size={7} />
                    <div className={""}>
                        <p><span className={'first-letter:uppercase'}>{firstName}</span> {String(lastName).toUpperCase()}</p>
                        <p className={"italic text-gray-400"}>{calculateTime(timestamp)}</p>
                    </div>
                </div>
                <p className={"p-2 rounded-lg bg-gray-100 flex flex-grow"}>{content}</p>
            </div>
            <div className={"w-full flex items-center justify-evenly"}>
                <div className={`p-1 rounded-lg hover:cursor-pointer hover:bg-gray-200 flex items-center space-x-2 ${resultSetLikeComment.isLoading ? "pointer-events-none": ""}`}
                     onClick={() => setLikeComment({idComment, idUser: user?._id})}
                >
                    {metaData?.flagLikeComment ? <ThumbUpIconSolid className={"h-5 text-blue-600"} /> : <ThumbUpIconOutline className={"h-5 text-blue-600"} />}
                    <p>{metaData?.nbrLikesComment ? metaData?.nbrLikesComment : 0}</p>
                </div>
                <div className={`p-1 rounded-lg hover:cursor-pointer hover:bg-gray-200 flex items-center space-x-2 ${resultSetDislikeComment.isLoading ? "pointer-events-none": ""}`}
                     onClick={() => setDislikeComment({idComment, idUser: user?._id})}
                >
                    {metaData?.flagDislikeComment ? <ThumbDownIconSolid className={"h-5 text-red-600"} /> : <ThumbDownIconOutline className={"h-5 text-red-600"} />}
                    <p>{metaData?.nbrDislikesComment ? metaData?.nbrDislikesComment : 0}</p>
                </div>
            </div>
        </div>
    );
};

export default Comment;