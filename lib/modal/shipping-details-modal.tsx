"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getImageUrl } from "@/lib/utils";
import { useGetShippingByIdQuery } from "@/redux/features/shipping/shippingApi";
import {
  Calendar,
  CircleCheckBig,
  ImageOff,
  InfoIcon,
  MapPin,
} from "lucide-react";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  itemId: string | null;
}

export default function ShippingDetailsModal({ open, onClose, itemId }: Props) {
  const { data, isLoading } = useGetShippingByIdQuery(itemId || "", {
    skip: !itemId,
  });

  const item = data?.data;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="max-w-4xl! w-full h-[90vh] flex items-center justify-center"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl! w-full h-[90vh] overflow-y-auto!"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-2xl">Shipping Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-3">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              {item.parcel?.[0]?.image ? (
                <Image
                  src={getImageUrl(item.parcel[0].image)}
                  alt={item.parcel[0].name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageOff size={64} strokeWidth={1} />
                  <p className="mt-2 text-sm">No image available</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{item.parcel?.[0]?.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="outline">{item.zoneName}</Badge>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-3">
                  <h3 className="font-bold text-blue-600 flex items-center gap-2">
                    <MapPin size={18} /> From
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{item.address_from?.street1}</p>
                    <p>
                      {item.address_from?.city}, {item.address_from?.state}
                    </p>
                    <p>
                      {item.address_from?.countryName} (
                      {item.address_from?.country})
                    </p>
                    <p className="text-gray-500 pt-1">
                      {item.address_from?.phone}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {item.address_from?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-blue-600 flex items-center gap-2">
                    <MapPin size={18} /> To
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{item.address_to?.street1}</p>
                    <p>
                      {item.address_to?.city}, {item.address_to?.state}
                    </p>
                    <p>
                      {item.address_to?.countryName} ({item.address_to?.country}
                      )
                    </p>
                    <p className="text-gray-500 pt-1">
                      {item.address_to?.phone}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {item.address_to?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parcel Items */}
              {item.parcel && item.parcel.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-bold">Parcel Details</h3>
                  <div className="space-y-2">
                    {item.parcel.map((p: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white border rounded-lg p-3 text-sm"
                      >
                        <div className="flex justify-between font-medium">
                          <span>{p.name}</span>
                          <span className="text-blue-600">{p.itemType}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {p.description}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                          <span>
                            {p.length}x{p.width}x{p.height} {p.distance_unit}
                          </span>
                          <span>
                            {p.weight} {p.mass_unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-gray-50 p-6 rounded-2xl flex flex-col">
            <h3 className="text-lg font-bold mb-6">
              Shipment & Status Timeline
            </h3>

            <div className="space-y-1 flex-1">
              {[
                {
                  label: "Shipping Registered",
                  completed: item.currentState?.registered,
                },
                {
                  label: "Payment Complete",
                  completed: item.currentState?.paymentCompleted,
                },
                {
                  label: "Courier Booked",
                  completed: item.currentState?.courierBooked,
                },
                {
                  label: "Delivered",
                  completed: item.currentState?.delivered,
                },
              ]
                .filter((step) => step.completed)
                .map((step, index, arr) => {
                  const isLast = index === arr.length - 1;
                  const isCompleted = step.completed;

                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                            isCompleted
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white text-gray-300"
                          }`}
                        >
                          <CircleCheckBig size={20} />
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-10 mt-1 ${
                              isCompleted ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pt-1">
                        <p
                          className={`text-sm font-semibold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}
                        >
                          {step.label}
                        </p>
                        {isCompleted && (
                          <p className="text-xs text-blue-600">Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Additional Info */}
            <div className="mt-8 space-y-4 pt-6 border-t">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  Total Cost
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  ${item.total_cost || 0}
                </p>
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-2 mb-2 text-sm">
                  <InfoIcon size={16} className="text-gray-400" />
                  Notes
                </h4>
                <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border italic">
                  "{item.notes || "No special instructions provided."}"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
