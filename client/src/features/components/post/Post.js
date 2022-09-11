import Avatar from "../Avatar";
import {baseQueryFileURL} from "../../../config";
import {XIcon} from "@heroicons/react/solid";
import {useDeletePostMutation, useLazyGetMetaDataPostQuery} from "../../api/postApi";
import Loading from "../Loading";
import {useSelector} from "react-redux";
import {selectUser} from "../../slices/userSlice";
import calculateTime from "../../utils/calculateTimestamp";
import {useEffect} from "react";
import Socket from '../../socket/Socket';
import Comments from "../comment/Comments";
import MetaDataPost from "./MetaDataPost";

function Post ({idPost, idUser, srcImgUser, firstName, lastName, timestamp, status, srcImgPost}) {

    const user = useSelector(selectUser);

    const [deletePost, resultDeletePost] = useDeletePostMutation();

    useEffect(() => {
        if(resultDeletePost.isSuccess) Socket.emit('deletePost', resultDeletePost.data)
    }, [resultDeletePost.isSuccess])

    const [triggerMetaDataPost, {currentData: metaDataPost}] = useLazyGetMetaDataPostQuery();

    useEffect(() => {
        if(user && user?._id){
            triggerMetaDataPost({idPost, idUser: user?._id});
        }
    }, [user])

    useEffect(() => {
        console.log(timestamp)
    }, [timestamp])

    return (
        <div className={"flex flex-col items-center w-full bg-white border border-gray-300 py-3 relative mb-3"}>
            {
                user?._id === idUser ?
                    resultDeletePost?.isLoading ?
                        <div className={"absolute top-0 left-0 w-full h-full bg-loading flex items-center justify-center"}>
                            <Loading className={"w-10 h-10 fill-blue-400 text-gray-200"} />
                        </div>
                        :
                        <div onClick={() => deletePost({idPost})} className={"absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600"}>
                            <XIcon className={"h-6 w-6"} />
                        </div>
                    :
                    ''
            }
            <div className={"flex items-center w-full px-3 space-x-2 mb-3"}>
                <Avatar srcImg={srcImgUser} size={10} />
                <div>
                    <p className={"font-bold text-sm md:text-base"}><span className={'first-letter:uppercase'}>{firstName}</span> {String(lastName).toUpperCase()}</p>
                    <span className={"text-sm italic text-gray-400"}>{calculateTime(timestamp)}</span>
                </div>
            </div>
            <div className={"w-full text-justify px-3 whitespace-normal break-normal text-sm md:text-base leading-5 mb-3"}>
                {status}
            </div>
            {
                srcImgPost && srcImgPost.length > 0 ?
                    <img src={baseQueryFileURL + srcImgPost} alt={""} className={"w-full mb-3"} />
                    :
                    ""
            }
            <MetaDataPost idPost={idPost} />
            <Comments idPost={idPost} nbrComments={metaDataPost?.nbrComments} />
        </div>
    );
};

export default Post;