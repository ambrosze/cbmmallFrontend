import { setCredentials } from "@/redux-store/apiSlice/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { destroyCookie, parseCookies } from "nookies";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const allCookies = parseCookies();
    const token = allCookies["token"]; // auth token
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // existing store header logic
    const loginResponseStr =
      typeof window !== "undefined"
        ? localStorage.getItem("authLoginResponse")
        : null;
    if (loginResponseStr) {
      try {
        const loginResponse = JSON.parse(loginResponseStr);
        const selectedStoreId =
          typeof window !== "undefined"
            ? localStorage.getItem("selectedStoreId")
            : null;
        const storeId = selectedStoreId || loginResponse?.user?.staff?.store_id;
        if (storeId !== undefined && storeId !== null) {
          headers.set("x-store", storeId.toString());
        }
      } catch (error) {
        console.error("Error parsing authLoginResponse:", error);
      }
    }

    // NEW: cart token header (priority: localStorage -> cookie)
    let cartToken = null;
    if (typeof window !== "undefined") {
      cartToken =
        localStorage.getItem("cart_token") || localStorage.getItem("cartToken");
    }
    if (!cartToken) {
      cartToken = allCookies["cart_token"] || allCookies["cartToken"];
    }
    if (cartToken) {
      headers.set("x-cart-token", cartToken);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authLoginResponse");
      localStorage.removeItem("selectedStoreId");
      localStorage.removeItem("cart_token");
      localStorage.removeItem("cartToken");
    }

    // Clear cookies
    destroyCookie(null, "token", { path: "/" });
    destroyCookie(null, "cart_token", { path: "/" });
    destroyCookie(null, "cartToken", { path: "/" });

    // Clear Redux state
    api.dispatch(
      setCredentials({
        token: null,
        user: null,
      })
    );

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  reducerPath: "api",
  tagTypes: [""],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
});

export const { useLazyQuery, useLazyMutation, useQuery, useMutation } = api;
