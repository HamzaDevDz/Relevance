import {baseApi} from "./baseApi";
import Socket from "../socket/Socket";
export const postApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: ({limit}) => `posts/getPosts/${limit}`,
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    Socket.on('addPost', (newPost) => {
                        updateCachedData((draft) => {
                            draft.unshift(newPost);
                        });
                    })
                    Socket.on('deletePost', (idPost) => {
                        updateCachedData((draft) => {
                            const indexPostsDeleted = draft.findIndex(p => p._id === idPost);
                            if(indexPostsDeleted !== -1) draft.splice(indexPostsDeleted, 1);
                        });
                    })
                } catch {}
                await cacheEntryRemoved;
            },
        }),
        addPost: builder.mutation({
            query: (newPost) => ({
                url: "posts/addPost",
                method: "POST",
                body: newPost,
            }),
        }),
        deletePost: builder.mutation({
            query: ({idPost}) => ({
                url: `posts/deletePost/${idPost}`,
                method: "DELETE",
            }),
            invalidatesTags: ['MyPosts'],
        }),
        getMetaDataPost: builder.query({
            query: ({idPost, idUser}) => `posts/getMetaDataPost/${idPost}/${idUser}`,
        }),
        setLikePost: builder.mutation({
            query: ({idPost, idUser}) => ({
                url: `posts/setLikePost/${idPost}`,
                method: "PUT",
                body: {idUser}
            }),
        }),
        setDislikePost: builder.mutation({
            query: ({idPost, idUser}) => ({
                url: `posts/setDislikePost/${idPost}`,
                method: "PUT",
                body: {idUser}
            }),
        }),

        getMyPosts: builder.query({
            query: ({idUser, limit}) => `posts/getMyPosts/${idUser}/${limit}`,
            providesTags: ['MyPosts'],
        }),
    }),
})

export const {
    useGetPostsQuery,
    useAddPostMutation,
    useDeletePostMutation,
    useSetLikePostMutation,
    useSetDislikePostMutation,
    useLazyGetMetaDataPostQuery,
    useGetMyPostsQuery,
} = postApi;
