import { baseApi } from "@/redux/api/baseApi";

const locationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchLocations: builder.query<any, { type?: string; search: string }>({
      query: ({ type, search }) => ({
        url: "/shipping/searchLocations",
        params: {
          type,
          search,
        },
        method: "GET",
      }),
    }),
  }),
});

export const { useSearchLocationsQuery } = locationsApi;
