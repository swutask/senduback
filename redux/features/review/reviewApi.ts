import { baseApi } from "@/redux/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
      }: {
        page?: number;
        limit?: number;
        searchTerm?: string;
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (searchTerm) {
          params.append("searchTerm", searchTerm);
        }
        return `/review?${params.toString()}`;
      },
      providesTags: ["Review"],
    }),

    // Get single review by ID
    getReviewById: builder.query({
      query: (id: string) => `/review/${id}`,
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),

    createReview: builder.mutation({
      query: (reviewData: {
        name: string;
        email: string;
        rating: number;
        comment: string;
      }) => ({
        url: "/review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review"],
    }),

    // Delete review
    deleteReview: builder.mutation({
      query: (id: string) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
