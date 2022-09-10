import {baseApi} from "./baseApi";
import Socket from "../socket/Socket";

export const commentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getComments: builder.query({
            query: ({idPost}) => `comments/getComments/${idPost}`,
        }),
        addComment: builder.mutation({
            query: (newComment) => ({
                url: "comments/addComment",
                method: "POST",
                body: newComment,
            }),
        }),
        deleteComment: builder.mutation({
            query: ({idComment}) => ({
                url: `comments/deleteComment/${idComment}`,
                method: "DELETE",
            }),
        }),

        getMetaDataComment: builder.query({
            query: ({idComment, idUser}) => `comments/getMetaDataComment/${idComment}/${idUser}`,
        }),
        setLikeComment: builder.mutation({
            query: ({idComment, idUser}) => ({
                url: `comments/setLikeComment/${idComment}`,
                method: "PUT",
                body: {idUser}
            }),
        }),
        setDislikeComment: builder.mutation({
            query: ({idComment, idUser}) => ({
                url: `comments/setDislikeComment/${idComment}`,
                method: "PUT",
                body: {idUser}
            }),
        }),
    }),
})

export const {
    useLazyGetCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useLazyGetMetaDataCommentQuery,
    useSetLikeCommentMutation,
    useSetDislikeCommentMutation,
} = commentApi;
