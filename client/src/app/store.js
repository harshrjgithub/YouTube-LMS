import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { authApi } from "../features/api/authApi.js";
import { courseApi } from "../features/api/courseApi.js";

export const appstore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware),
});