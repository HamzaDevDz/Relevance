import {baseApi} from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        logIn: builder.mutation({
            query: (user) => ({
                url: `users/login`,
                method: 'POST',
                body: user
            }),
        }),
        signUp: builder.mutation({
            query: (user) => ({
                url: "users/signup",
                method: "POST",
                body: user,
            }),
        }),
    }),
    overrideExisting: false,
})

export const {
    useLogInMutation,
    useSignUpMutation
} = userApi;
