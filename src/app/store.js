import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../entities/auth-form/model/authSlice.js";
import api from "./api";
import { userTokensApi } from "../shared/context/api.js";
import { favoritesApi } from "../shared/ui/modal/api.js"
import { subscriptionApi } from "../pages/subscription-page/api/api.js";

// ✅ Фильтруем только API-объекты с reducerPath
const allApis = [
    api,
    userTokensApi,
    favoritesApi,
    subscriptionApi
].filter((api) => api?.reducerPath && api?.middleware);

// ✅ Автоматически добавляем API в reducers и middleware
const reducers = combineReducers({
    auth: authReducer,
    ...allApis.reduce((acc, api) => ({ ...acc, [api.reducerPath]: api.reducer }), {}),
});

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(allApis.map((api) => api.middleware)),
});

export default store;
