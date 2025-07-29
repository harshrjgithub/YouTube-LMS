import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import authReducer from "../features/authSlice"; // Import the authSlice reducer
import { courseApi } from "../features/api/courseApi"; // Example for another API slice

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer, // Add the auth reducer
  // Add other reducers here as needed
  [courseApi.reducerPath]: courseApi.reducer, // Example for another API slice
});

export default rootReducer;