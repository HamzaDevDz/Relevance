import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000/api/' }),
    tagTypes: ['Windows, MyPosts'],
    endpoints: () => ({}),
})