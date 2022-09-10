import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import userReducer from "../features/slices/userSlice";
import postsReducer from "../features/slices/postsSlice";
import messagesReducer from "../features/slices/messagesSlice";
import {baseApi} from "../features/api/baseApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    messages: messagesReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
          .concat(baseApi.middleware)
});

setupListeners(store.dispatch);
