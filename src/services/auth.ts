import { setCookie } from "nookies";
import { api } from ".";

interface LoginResponse {
  token: string;
  user: any;
}

interface LoginRequest {
  email: string;
  password: string;
  remember_me: number; // 0 or 1
}
interface SignUpRequest {
  email: string;
  referral_code: string;
  password: string;
  password_confirmation: string;
}
interface VerifyEmailRequest {
  otp_code: string;
}
interface PasswordConfirmationRequest {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}
interface forgotPasswordRequest {
  email: string;
}
interface verifyPasswordResetTokenRequest {
  token: string;
}
interface resetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}
interface changePasswordRequest {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}
interface UpdateProfileRequest {
  first_name: string;
  middle_name?: string;
  last_name: string;
  preferred_name?: string;
  dialing_code?: string;
  phone_number: string;
  profile_photo?: string | null;
}

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginRequest>({
      query: (body) => ({
        url: "login",
        method: "POST",
        body: body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Set the token in cookies
          setCookie(null, "token", (data as any)?.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: "/",
            sameSite: "lax", // Recommended for security reasons
            secure: process.env.NODE_ENV !== "development", // Only set secure cookies in production
          });
        } catch (error) {
          // Handle error
        }
      },
    }),

    register: builder.mutation<any, SignUpRequest>({
      query: (body) => ({
        url: "register",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("🚀 ~ onQueryStarted ~ data-register:", data);

          // Set the token in cookies
          setCookie(null, "token", (data as any)?.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: "/",
            sameSite: "lax", // Recommended for security reasons
            secure: process.env.NODE_ENV !== "development", // Only set secure cookies in production
          });
        } catch (error) {
          // Handle error
        }
      },
    }),
    verifyEmail: builder.mutation<any, VerifyEmailRequest>({
      query: (body) => ({
        url: "email/verify",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    emailVerificationToken: builder.mutation<any, any>({
      query: () => ({
        url: "email/verification-token",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    passwordConfirmation: builder.mutation<any, PasswordConfirmationRequest>({
      query: (body) => ({
        url: "password_confirmation",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    forgetPassword: builder.mutation<any, forgotPasswordRequest>({
      query: (body) => ({
        url: "forget-password",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    verifyPasswordResetToken: builder.mutation<
      any,
      verifyPasswordResetTokenRequest
    >({
      query: (body) => ({
        url: "verify-password-reset-token",
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    resetPassword: builder.mutation<any, resetPasswordRequest>({
      query: (body) => ({
        url: "reset-password",
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    changeInAppPassword: builder.mutation<any, changePasswordRequest>({
      query: (body) => ({
        url: "change-password",
        method: "PUT",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateProfile: builder.mutation<any, UpdateProfileRequest>({
      query: (body) => ({
        url: "user/profile",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    logout: builder.mutation<any, any>({
      query: () => ({
        url: "logout",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  usePasswordConfirmationMutation,
  useResetPasswordMutation,
  useForgetPasswordMutation,
  useVerifyPasswordResetTokenMutation,
  useEmailVerificationTokenMutation,
  useVerifyEmailMutation,
  useChangeInAppPasswordMutation,
  useUpdateProfileMutation,
} = authApi;
