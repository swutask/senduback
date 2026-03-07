import { baseApi } from "@/redux/api/baseApi";

export const zoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all zones
    getZones: builder.query({
      query: ({ page = 1, limit = 10, countries = "" }) => ({
        url: "/zone",
        method: "GET",
        params: {
          page,
          limit,
          ...(countries && { countries }),
        },
      }),
      transformResponse: (response: any) => response,
      providesTags: ["Zone"],
    }),

    // GET single zone by ID
    getZoneById: builder.query({
      query: (id: string) => `/zone/${id}`,
      providesTags: (result, error, id) => [{ type: "Zone", id }],
    }),

    // POST create zone
    createZone: builder.mutation({
      query: (zoneData: { name: string; countries: string[] }) => ({
        url: "/zone",
        method: "POST",
        body: zoneData,
      }),
      invalidatesTags: ["Zone"],
    }),

    // PATCH update zone
    updateZone: builder.mutation({
      query: ({ id, zoneData }: { id: string; zoneData: any }) => ({
        url: `/zone/${id}`,
        method: "PATCH",
        body: zoneData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Zone",
        { type: "Zone", id },
      ],
    }),
  }),
});

export const {
  useGetZonesQuery,
  useGetZoneByIdQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
} = zoneApi;
