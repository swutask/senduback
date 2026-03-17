import { baseApi } from "@/redux/api/baseApi";

const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProperties: builder.query({
      query: ({
        page = 1,
        limit = 10,
      }: { page?: number; limit?: number } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `/property/my-properties?${params.toString()}`;
      },
      providesTags: ["Property"],
    }),

    getUserProperties: builder.query({
      query: (id: string) => `/property/user/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    createProperty: builder.mutation({
      query: (data) => ({
        url: "/property",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    updateProperty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/property/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    getPropertyById: builder.query({
      query: (id: string) => `/property/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    deleteProperty: builder.mutation({
      query: (id: string) => ({
        url: `/property/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),
  }),
});

export const {
  useGetMyPropertiesQuery,
  useGetUserPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} = propertyApi;
