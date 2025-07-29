import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: null,
    isAuth: false,
}



const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers:{
        userLoggedIn: (state, action) => {
            state.user = action.payload;
            state.isAuth = true;
        },
        userLoggedOut: (state) => {
            state.user = null;
            state.isAuth = false;
        }
    }
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;