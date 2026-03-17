import { baseApi } from "@/redux/api/baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all FAQs
    getFAQ: builder.query({
      query: () => ({
        url: "/public/faq/all",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response?.data;
      },
      providesTags: ["FAQ"],
    }),

    // CREATE new FAQ
    createFAQ: builder.mutation({
      query: (data: { question: string; answer: string }) => ({
        url: "/public/faq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FAQ"],
    }),

    // UPDATE existing FAQ
    updateFAQ: builder.mutation({
      query: ({
        id,
        ...data
      }: {
        id: string;
        question?: string;
        answer?: string;
      }) => ({
        url: `/public/faq/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "FAQ",
        { type: "FAQ", id },
      ],
    }),

    // DELETE FAQ
    deleteFAQ: builder.mutation({
      query: (id: string) => ({
        url: `/public/faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetFAQQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;
