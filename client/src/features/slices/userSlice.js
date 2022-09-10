import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user: undefined,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            sessionStorage.setItem('user', JSON.stringify(action.payload));
            state.user = action.payload;
        },
        resetUser: (state) => {
            sessionStorage.removeItem('user');
            state.user = undefined;
        },
    },
});

export const { setUser, resetUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;


export default userSlice.reducer;
