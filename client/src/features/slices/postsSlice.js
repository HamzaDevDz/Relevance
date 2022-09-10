import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    posts: [],
};

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = [...action.payload];
        },
        addPost: (state, action) => {
            console.log(state.posts.findIndex(p => p._id === action.payload._id))
            state.posts.unshift(action.payload);
        },
        deletePost: (state, action) => {
            const index = state.posts.findIndex(m => m._id === action.payload);
            state.posts.splice(index, 1);
        },
        loadMorePosts: (state, action) => {
            action.payload.forEach(p => state.posts.push(p));
        },

    },
});

export const { setPosts, addPost, deletePost, loadMorePosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;
export const selectLengthPosts = state => state.posts.posts.length;

export default postsSlice.reducer;
