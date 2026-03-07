import { baseApi } from "@/redux/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST endpoint
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review"],
    }),

    // GET all endpoint
    getAllReviews: builder.query({
      query: () => "/review",
      providesTags: ["Review"],
    }),

    // GET single endpoint
    getReviewById: builder.query({
      query: (id) => `/review/${id}`,
      providesTags: ["Review"],
    }),

    // DELETE endpoint
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useDeleteReviewMutation,
} = reviewApi;
