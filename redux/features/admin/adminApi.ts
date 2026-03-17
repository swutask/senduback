import { baseApi } from "@/redux/api/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStatistics: builder.query({
      query: () => "/dashboard/adminStatistics",
      providesTags: ["AdminStatistics"],
    }),
  }),
});

export const { useGetAdminStatisticsQuery } = adminApi;
