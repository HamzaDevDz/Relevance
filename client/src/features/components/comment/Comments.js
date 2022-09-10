import Loading from "../Loading";
import Avatar from "../Avatar";
import {ChevronDoubleRightIcon} from "@heroicons/react/solid";
import {DotsHorizontalIcon} from "@heroicons/react/outline";
import Comment from "./Comment";
import {useAddCommentMutation, useLazyGetCommentsQuery} from "../../api/commentApi";
import {useEffect, useRef, useState} from "react";
import Socket from "../../socket/Socket";
import {selectUser} from "../../slices/userSlice";
import {useSelector} from "react-redux";

function Comments ({idPost, nbrComments}) {

    const user = useSelector(selectUser);

    const refComment = useRef(undefined);

    const [showComments, setShowComments] = useState(false);

    const [triggerComment, {currentData: comments, isFetching}] = useLazyGetCommentsQuery();
    const [addComment, resultAddComment] = useAddCommentMutation();

    const submitComment = e => {
        e.preventDefault();
        if(refComment.current === undefined || refComment.current === null || refComment.current.value === "") return;
        addComment({
            idPost,
            idUser: user?._id,
            content: refComment.current.value,
            timestamp: new Date()
        })
    }

    useEffect(() => {
        if(resultAddComment.isSuccess) {
            Socket.emit("getComments", resultAddComment.data);
            refComment.current.value = "";
        }
    }, [resultAddComment.isSuccess])

    useEffect(() => {
        if(showComments){
            triggerComment({idPost});
            Socket.on('getComments', (idPostSocket) => {
                if(idPostSocket === idPost) triggerComment({idPost});
            });
        }
    }, [showComments])

    return (
        <div className={'w-full flex flex-col items-center'}>
            <form className={"w-full flex flex-col items-center px-3 text-sm"}>
                <div className={"w-full flex items-center"}>
                    <Avatar srcImg={user?.urlImg} size={7} />
                    <input ref={refComment} placeholder={"Comment"} type={'text'} className={"flex flex-grow mx-3 focus:outline-none bg-gray-100 rounded-full p-3 focus:bg-gray-200 focus:ring-gray-400 focus:ring-1 scrollbar-hide resize-none"}/>
                    <button className={"rounded-full p-2 hover:bg-blue-100 text-blue-800 hover:cursor-pointer"} type={"submit"} disabled={resultAddComment.isLoading} onClick={submitComment}>
                        <ChevronDoubleRightIcon className={"h-5"} />
                    </button>
                </div>
                {
                    resultAddComment.isLoading ?
                        <div className={"w-full flex items-center justify-center"}>
                            <Loading className={"w-8 h-8 fill-blue-400 text-gray-200"} />
                        </div>
                        :
                        ""
                }
            </form>
            {
                !nbrComments || nbrComments === 0 ?
                    ''
                    :
                    !showComments ?
                        <div className={'px-2 py-1 rounded-lg hover:cursor-pointer hover:bg-gray-200 mt-3'} onClick={() => setShowComments(!showComments)} >
                            <DotsHorizontalIcon className={"h-6 text-gray-600 "} />
                        </div>
                        :
                        isFetching && !comments ?
                            <Loading className={"w-8 h-8 fill-blue-400 text-gray-200 mt-3"} />
                            :
                            comments?.map(({
                                               _id,
                                               idUser,
                                               timestamp,
                                               content,
                                               firstName,
                                               lastName,
                                               urlImgUser,
                                               nbrLikesComment,
                                               nbrDislikesComment,
                                               flagLikeComment,
                                               flagDislikeComment
                                           }, index)=>(<Comment
                                key={_id}
                                idPost={idPost}
                                idComment={_id}
                                idUser={idUser}
                                timestamp={timestamp}
                                firstName={firstName}
                                lastName={lastName}
                                content={content}
                                urlImgUser={urlImgUser}
                                nbrLikesComment={nbrLikesComment}
                                nbrDislikesComment={nbrDislikesComment}
                                flagLikeComment={flagLikeComment}
                                flagDislikeComment={flagDislikeComment}
                            />))

            }
        </div>
    )
}

export default Comments;