import {baseApi} from "./baseApi";

export const searchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        searchFriends: builder.mutation({
            query: ({idUser, name}) => ({
                url: `users/search`,
                method: 'POST',
                body: {idUser: idUser, name: name}
            }),
        }),
    }),
    overrideExisting: false,
})

export const {
    useSearchFriendsMutation
} = searchApi;
