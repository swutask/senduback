import { baseApi } from "@/redux/api/baseApi";

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippings: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status,
      }: {
        page?: number;
        limit?: number;
        status?: string;
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) {
          params.append("status", status);
        }
        return `/shipping?${params.toString()}`;
      },
      providesTags: ["Shipping"],
    }),

    getShippingById: builder.query({
      query: (id: string) => `/shipping/${id}`,
      providesTags: ["Shipping"],
    }),

    createShippingInfo: builder.mutation({
      query: ({
        id,
        trackingData,
        shippingLabel,
      }: {
        id: string;
        trackingData: {
          tracking_id: string;
          tracking_url: string;
          carrier: string;
        };
        shippingLabel: File;
      }) => {
        const formData = new FormData();
        formData.append("shippingLabel", shippingLabel);
        formData.append("data", JSON.stringify(trackingData));

        return {
          url: `/shipping/${id}/shippingInfo`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Shipping"],
    }),

    addShipping: builder.mutation({
      query: (shippingData) => ({
        url: "/shipping",
        method: "POST",
        body: shippingData,
      }),
      invalidatesTags: ["Shipping"],
    }),

    getShippingRates: builder.mutation<any, string>({
      query: (orderId) => ({
        url: `/shipping/getShippingRates/${orderId}`,
        method: "POST",
      }),
    }),

    addSelectedRate: builder.mutation({
      query: ({ orderId, id }) => ({
        url: `/shipping/addRateOrInsurance/${orderId}`,
        method: "POST",
        body: { selected_rate: id },
      }),
      invalidatesTags: ["Shipping"],
    }),

    addInsurance: builder.mutation({
      query: ({ orderId, insurance }) => ({
        url: `/shipping/addRateOrInsurance/${orderId}`,
        method: "POST",
        body: { insurance },
      }),
      invalidatesTags: ["Shipping"],
    }),

    getLostItem: builder.query({
      query: (id) => `/lost-item/${id}`,
    }),
  }),
});

export const {
  useGetLostItemQuery,
  useGetShippingsQuery,
  useCreateShippingInfoMutation,
  useGetShippingByIdQuery,
  useAddShippingMutation,
  useGetShippingRatesMutation,
  useAddInsuranceMutation,
  useAddSelectedRateMutation,
} = shippingApi;
