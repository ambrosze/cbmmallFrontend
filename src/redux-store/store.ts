// store.ts
import { api } from "@/services";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./apiSlice/authSlice";
import openGlobalModalReducer from "./slice/globalModalToggle";
import userProfileReducer from "./slice/userProfileSlice";

import { persistMiddleware } from "./middleware/persistMiddleWare";

const loadState = () => {
  if (typeof window !== "undefined") {
    try {
      const serializedAuthState = localStorage.getItem("auth");

      if (serializedAuthState === null) {
        return undefined;
      }
      return {
        auth: serializedAuthState ? JSON.parse(serializedAuthState) : undefined,
      };
    } catch (err) {
      return undefined;
    }
  }
  return undefined;
};

const makeStore = () => {
  const preloadedState = loadState();

  const store = configureStore({
    reducer: {
      auth: authReducer,
      openGlobalModal: openGlobalModalReducer,
      userProfile: userProfileReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, persistMiddleware),
    preloadedState,
    devTools: process.env.NODE_ENV !== "production",
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
