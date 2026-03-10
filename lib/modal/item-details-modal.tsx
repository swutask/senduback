"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetLostItemByIdQuery } from "@/redux/features/lostItem/lostitemApi";
import {
  InfoIcon,
  ImageOff,
  MapPin,
  Calendar,
  User,
  Send,
  CircleCheckBig,
  Phone,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { UserRole } from "@/config/menuConfig";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  itemId: string | null;
}

export default function ItemDetailsModal({ open, onClose, itemId }: Props) {
  const user = useAppSelector(selectCurrentUser);
  const role: UserRole = user?.role ?? "user";

  const { data, isLoading } = useGetLostItemByIdQuery(itemId || "", {
    skip: !itemId,
  });

  const item = data?.data;

  console.log(item);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-full md:max-w-4xl h-[90vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full md:max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-2xl">Item Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-3">
          {/* Left */}
          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={getImageUrl(item.images[0])}
                  alt={item.itemName}
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
              <h2 className="text-2xl font-bold">{item.itemName}</h2>
              <p className="text-sm text-gray-600">{item.itemDescription}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  <span className="font-semibold">Found Location:</span>
                  <span>{item.locationFound}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-500" />
                  <span className="font-semibold">Date Found:</span>
                  <span>{new Date(item.dateFound).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-bold">Guest Details</h2>

              <div className="space-y-3 text-sm">
                <InfoRow
                  icon={<User size={18} />}
                  label="Name"
                  value={item.guestName}
                />
                <InfoRow
                  icon={<Send size={18} />}
                  label="Email"
                  value={item.guestEmail}
                />
                <InfoRow
                  icon={<InfoIcon size={18} />}
                  label="Status"
                  value={
                    item.status.charAt(0).toUpperCase() + item.status.slice(1)
                  }
                />
              </div>
            </div>

            {/* Business Details */}

            {role === "admin" && (
              <div className="space-y-4 pt-4 border-t">
                <h2 className="text-xl font-bold">Business Details</h2>

                <div className="space-y-3 text-sm">
                  <InfoRow
                    icon={<User size={18} />}
                    label="Business Name"
                    value={item?.user?.businessDetails?.businessName}
                  />
                  <InfoRow
                    icon={<Send size={18} />}
                    label="Business Email"
                    value={item?.user?.businessDetails?.businessEmail}
                  />
                  <InfoRow
                    icon={<Phone size={18} />}
                    label="Business Phone"
                    value={item?.user?.businessDetails?.telephone}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-6">
              Shipment & Status Timeline
            </h3>

            <div className="space-y-1">
              {[
                {
                  label: "Item Registered",
                  completed: item.currentState?.registered,
                },
                {
                  label: "Customer Link Sent",
                  completed: item.currentState?.linkSended,
                },
                ...(!item.currentState?.paymentCompleted
                  ? [
                      {
                        label: "Collected",
                        completed: item.currentState?.collected,
                      },
                    ]
                  : []),
                {
                  label: "Payment Complete",
                  completed: item.currentState?.paymentCompleted,
                },
                {
                  label: "With Courier",
                  completed: item.currentState?.withCourier,
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
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t mt-4">
          <Button variant="outline" onClick={onClose} className="mr-3">
            Close
          </Button>
          {/* {!item.currentState?.linkSended && (
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Send size={18} />
              Send Customer Link
            </Button>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-gray-600">{label}:</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
