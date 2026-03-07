import { baseApi } from "@/redux/api/baseApi";

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateBusinessDetails: builder.mutation({
      query: (formData) => {
        return {
          url: "/business-details/update-business-details",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Business", "User"],
    }),
  }),
});

export const { useUpdateBusinessDetailsMutation } = businessApi;
