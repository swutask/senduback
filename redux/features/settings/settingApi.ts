import { baseApi } from "@/redux/api/baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => `/settings`,
      providesTags: ["Settings"],
    }),
    updateSetting: builder.mutation({
      query: (data) => ({
        url: `/settings`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingMutation } = settingsApi;
