import { baseApi } from "@/redux/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStatistics: builder.query({
      query: () => "/dashboard/adminStatistics",
      providesTags: ["Dashboard"],
    }),
    getBusinessStatistics: builder.query({
      query: () => "/dashboard/businessStatistics",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetAdminStatisticsQuery, useGetBusinessStatisticsQuery } =
  dashboardApi;
