import { baseApi } from "@/redux/api/baseApi";

export const lostItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated lost items
    getLostItems: builder.query({
      query: ({ page = 1, limit = 10 }: { page?: number; limit?: number }) =>
        `/lost-item?page=${page}&limit=${limit}`,
      providesTags: ["LostItem"],
    }),

    // Get single lost item by ID
    getLostItemById: builder.query({
      query: (id: string) => `/lost-item/${id}`,
      providesTags: (result, error, id) => [{ type: "LostItem", id }],
    }),

    // Create new lost item
    createLostItem: builder.mutation({
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
  }),
});

export const {
  useGetLostItemsQuery,
  useGetLostItemByIdQuery,
  useCreateLostItemMutation,
  useUpdateLostItemMutation,
  useDeleteLostItemMutation,
  useUploadLostItemImageMutation,
  useSendLostItemEmailMutation,
  useMarkAsManuallySentMutation,
} = lostItemApi;
