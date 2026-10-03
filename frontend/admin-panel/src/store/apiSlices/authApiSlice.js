import { baseApiSlice } from "./baseApiSlice";

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyLogin2FA: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-2fa",
        method: "POST",
        body,
      }),
    }),
    resendLogin2FAOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-2fa-otp",
        method: "POST",
        body,
      }),
    }),
    forgotPasswordRequestOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password/request-otp",
        method: "POST",
        body,
      }),
    }),
    forgotPasswordReset: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password/reset",
        method: "POST",
        body,
      }),
    }),
    getAuthMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["AdminProfile"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useVerifyLogin2FAMutation,
  useResendLogin2FAOtpMutation,
  useForgotPasswordRequestOtpMutation,
  useForgotPasswordResetMutation,
  useGetAuthMeQuery,
} = authApiSlice;
