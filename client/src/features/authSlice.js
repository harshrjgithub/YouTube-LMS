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
            // Expect shape: { user: { id, name, email } }
            state.user = action.payload.user || null;
            state.isAuth = Boolean(state.user);
        },
        userLoggedOut: (state) => {
            state.user = null;
            state.isAuth = false;
        }
    }
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;