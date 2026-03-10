import { baseApi } from "@/redux/api/baseApi";

export enum LOST_ITEM_STATUS {
  REGISTERED = "registered",
  LINKSENDED = "linkSended",
  INTRANSIT = "inTransit",
  PAYMENTCOMPLETED = "paymentCompleted",
  WITHCOURIER = "withCourier",
  DELIVERED = "delivered",
  COLLECTED = "collected",
}

export const lostItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated lost items
    getLostItems: builder.query({
      query: ({
        page = 1,
        limit = 10,
        status,
        user,
        from,
        to,
        searchTerm,
      }: {
        page?: number;
        limit?: number;
        status?: LOST_ITEM_STATUS | LOST_ITEM_STATUS[];
        user?: string;
        from?: string;
        to?: string;
        searchTerm?: string;
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) {
          if (Array.isArray(status)) {
            status.forEach((s) => params.append("status", s));
          } else {
            params.append("status", status);
          }
        }
        if (user) params.append("user", user);
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (searchTerm) params.append("searchTerm", searchTerm);
        return `/lost-item?${params.toString()}`;
      },
      providesTags: ["LostItem"],
    }),

    getLostItemsByUser: builder.query({
      query: ({
        user,
        page = 1,
        limit = 10,
        search = "",
      }: {
        user: string;
        page?: number;
        limit?: number;
        search?: string;
      }) => {
        const params = new URLSearchParams({
          user,
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        return `/lost-item?${params.toString()}`;
      },
      providesTags: ["LostItem"],
    }),

    // Get single lost item by ID
    getLostItemById: builder.query({
      query: (id: string) => `/lost-item/${id}`,
      providesTags: (result, error, id) => [{ type: "LostItem", id }],
    }),

    getAllBusinessUsers: builder.query({
      query: ({ searchTerm }: { searchTerm?: string } = {}) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append("searchTerm", searchTerm);
        return `/user/all-business-users${params.toString() ? `?${params.toString()}` : ""}`;
      },
      providesTags: ["BusinessUser"],
    }),

    // Create new lost item
    registerLostItem: builder.mutation({
      query: (data) => ({
        url: "/lost-item",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LostItem"],
    }),

    // Update lost item by ID
    updateLostItem: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/lost-item/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "LostItem",
        { type: "LostItem", id },
      ],
    }),

    // Delete lost item by ID
    deleteLostItem: builder.mutation({
      query: (id: string) => ({
        url: `/lost-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LostItem"],
    }),

    // Upload image for lost item
    uploadLostItemImage: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/lost-item/upload-image/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["LostItem"],
    }),

    // Send email for lost item
    sendLostItemEmail: builder.mutation({
      query: ({ id, emailData }: { id: string; emailData?: any }) => ({
        url: `/lost-item/send-email/${id}`,
        method: "POST",
        body: emailData || {},
      }),
      invalidatesTags: ["LostItem"],
    }),

    // Mark as manually sent
    markAsManuallySent: builder.mutation({
      query: (id: string) => ({
        url: `/lost-item/manually-sent/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["LostItem"],
    }),

    // Mark as collected
    markAsCollected: builder.mutation({
      query: (id: string) => ({
        url: `/lost-item/markAsCollected/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["LostItem"],
    }),
  }),
});

export const {
  useGetLostItemsQuery,
  useGetLostItemsByUserQuery,
  useGetLostItemByIdQuery,
  useRegisterLostItemMutation,
  useGetAllBusinessUsersQuery,
  useUpdateLostItemMutation,
  useDeleteLostItemMutation,
  useUploadLostItemImageMutation,
  useSendLostItemEmailMutation,
  useMarkAsManuallySentMutation,
  useMarkAsCollectedMutation,
} = lostItemApi;
