// import { removeUser } from "../../slice/userSlice";
// import { baseApi } from "../../api/baseApi";

// const authApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         // create user
//         signUpUser: builder.mutation({
//             query: (data) => ({
//                 url: `/auth/signup`,
//                 method: "POST",
//                 body: data,
//             }),
//             invalidatesTags: ["Auth"],
//         }),

//         // login user
//         loginUser: builder.mutation({
//             query: (data) => ({
//                 url: "/auth/login",
//                 method: "POST",
//                 body: data,
//             }),
//             invalidatesTags: ["Auth"],
//         }),
//     }),
// });

// export const { useSignUpUserMutation, useLoginUserMutation } = authApi;

import { baseApi } from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    signup: builder.mutation({
      query: (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
      }) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    verifyAccount: builder.mutation({
      query: (data: { email: string; oneTimeCode: string }) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data: { email: string; authType: string }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => "/profile",
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyAccountMutation,
  useResendOtpMutation,
  useGetProfileQuery,
} = authApi;
