import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    messages: [],
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.unshift(action.payload);
        },
        deleteMessage: (state, action) => {
            const index = state.messages.findIndex(m => m._id === action.payload);
            state.messages.splice(index, 1);
        },
        uploadMoreMessages: (state, action) => {
            action.payload.forEach(m => state.messages.push(m));
        },
    },
});

export const { setMessages, addMessage, deleteMessage, uploadMoreMessages } = messagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;


export default messagesSlice.reducer;
