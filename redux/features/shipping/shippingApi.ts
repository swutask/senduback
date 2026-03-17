import { baseApi } from "@/redux/api/baseApi";

export enum SHIPPING_STATUS {
  PAYMENT_PENDING = "paymentPending",
  PAYMENT_COMPLETED = "paymentCompleted",
  IN_TRANSIT = "inTransit",
  DELIVERED = "delivered",
}

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippings: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status,
        fromEmail,
        from,
        to,
        searchTerm,
      }: {
        page?: number;
        limit?: number;
        status?: string[];
        fromEmail?: string;
        from?: string;
        to?: string;
        searchTerm?: string;
      }) => {
        const query: Record<string, string> = {
          page: page.toString(),
          limit: limit.toString(),
          ...(status?.length && { status: status.join(",") }),
          ...(fromEmail && { "address_from.email": fromEmail }),
          ...(from && { from }),
          ...(to && { to }),
          ...(searchTerm && { searchTerm: searchTerm }),
        };
        const params = new URLSearchParams(query);
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

    markAsDelivered: builder.mutation({
      query: (id: string) => ({
        url: `/shipping/markAsDelivered/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Shipping"],
    }),

    deleteShippingItem: builder.mutation({
      query: (id: string) => ({
        url: `/shipping/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shipping"],
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
  useMarkAsDeliveredMutation,
  useDeleteShippingItemMutation,
} = shippingApi;
