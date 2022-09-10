import {baseApi} from "./baseApi";
import Socket from "../socket/Socket";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWindows:builder.query({
            query: ({idUser}) => `messages/getWindows/${idUser}`,
            providesTags: ['Windows'],
        }),
        openWindow: builder.mutation({
            query: ({idUser, idFriend}) => ({
                url: `messages/openWindow`,
                method: 'POST',
                body: {idUser: idUser, idFriend: idFriend}
            }),
            invalidatesTags: ['Windows'],
        }),
        getMessages:builder.query({
            query: ({idWindow, idUser, limit}) => `messages/getMessages/${idWindow}/${idUser}/${limit}`,
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    Socket.on('addMessage', ({newMessage}) => {
                        if(arg.idWindow === newMessage.idWindow)
                            updateCachedData((draft) => {
                                draft.unshift(newMessage);
                            });
                    })
                    Socket.on('deleteMessage', ({idWindow, idMessage}) => {
                        if(arg.idWindow === idWindow)
                            updateCachedData((draft) => {
                                const indexMessageDeleted = draft.findIndex(m => m._id === idMessage);
                                if(indexMessageDeleted !== -1) draft.splice(indexMessageDeleted, 1);
                            });
                    })
                } catch {}
                await cacheEntryRemoved;
            },
        }),
        addMessage:builder.mutation({
            query: ({idWindow, content, idUser}) => ({
                url: `messages/addMessage`,
                method: 'POST',
                body: {idWindow, content, idUser}
            })
        }),
        deleteMessage:builder.mutation({
            query: ({idWindow, idMessage}) => ({
                url: `messages/deleteMessage/${idWindow}/${idMessage}`,
                method: 'DELETE',
            })
        }),
        setLastSeenIdMessage: builder.mutation({
            query: ({idUser, idWindow}) => ({
                url: `messages/setLastSeenIdMessage`,
                method: 'POST',
                body: {idUser, idWindow}
            })
        }),

    }),
    overrideExisting: false,
})

export const {
    useGetWindowsQuery,
    useOpenWindowMutation,
    useAddMessageMutation,
    useDeleteMessageMutation,
    useGetMessagesQuery,
    useSetLastSeenIdMessageMutation,
} = messageApi;
