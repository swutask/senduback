import { baseApi } from "@/redux/api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (orderId) => ({
        url: `/payment/checkout-session/${orderId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentApi;
