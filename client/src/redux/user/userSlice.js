import { createSlice } from "@reduxjs/toolkit";


const initalState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initalState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        }
    },


    signInSuccess: (state, action) => {
        state.currentUser = action.playload;
        state.loading = false;
        state.error = null;
    },

    signInFailure: (state, action) => {
        state.error = action.playload;
        state.loading = false;
    }
});
export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;
export default userSlice.reducer;
