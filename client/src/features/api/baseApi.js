import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {baseURL} from "../../config";

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: `${baseURL}/api` }),
    tagTypes: ['Windows, MyPosts'],
    endpoints: () => ({}),
})