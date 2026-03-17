import { baseApi } from "@/redux/api/baseApi";

export const zoneShipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all zone shipping prices - matches your /zone-pricing GET
    getZoneShips: builder.query({
      query: ({
        page = 1,
        limit = 10,
        fromZone,
        toZone,
        shippingType,
      }: {
        page?: number;
        limit?: number;
        fromZone?: number;
        toZone?: number;
        shippingType?: "express" | "standard";
      } = {}) => ({
        url: "/zone-pricing",
        method: "GET",
        params: {
          page,
          limit,
          ...(fromZone && { fromZone }),
          ...(toZone && { toZone }),
          ...(shippingType && { shippingType }),
        },
      }),
      // transformResponse: (response: any) => response,
      providesTags: ["ZoneShip"],
    }),

    // GET single zone shipping price by ID - matches your /zone-pricing/{id} GET
    getZoneShipById: builder.query({
      query: (id: string) => `/zone-pricing/${id}`,
      providesTags: (result, error, id) => [{ type: "ZoneShip", id }],
    }),

    createZoneShip: builder.mutation({
      query: (zoneShipData) => ({
        url: "/zone-pricing",
        method: "POST",
        body: zoneShipData,
      }),
      invalidatesTags: ["ZoneShip"],
    }),

    // DELETE zone shipping price - matches your /zone-pricing/{id} DELETE
    deleteZoneShip: builder.mutation({
      query: (id: string) => ({
        url: `/zone-pricing/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ZoneShip"],
    }),
  }),
});

export const {
  useGetZoneShipsQuery,
  useGetZoneShipByIdQuery,
  useCreateZoneShipMutation,
  useDeleteZoneShipMutation,
} = zoneShipApi;
