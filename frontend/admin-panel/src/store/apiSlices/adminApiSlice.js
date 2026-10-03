import { baseApiSlice } from "./baseApiSlice";

export const adminApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query({
      query: () => "/profile",
      providesTags: ["AdminProfile"],
    }),
    updateAdminProfile: builder.mutation({
      query: (body) => ({
        url: "/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminProfile"],
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/change-password",
        method: "PATCH",
        body,
      }),
    }),
    toggleTwoFactor: builder.mutation({
      query: (body) => ({
        url: "/toggle-2fa",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AdminProfile"],
    }),
    verifyTwoFactor: builder.mutation({
      query: (body) => ({
        url: "/verify-2fa",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminProfile"],
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangePasswordMutation,
  useToggleTwoFactorMutation,
  useVerifyTwoFactorMutation,
} = adminApiSlice;
