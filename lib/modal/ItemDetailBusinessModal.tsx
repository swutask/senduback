import { ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemDetailModalProps {
  item: any;
  onClose: () => void;
}

export function ItemDetailBusinessModal({
  item,
  onClose,
}: ItemDetailModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="min-w-4xl h-3/4 p-0 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <DialogHeader className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-row items-center justify-between space-y-0 z-10">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Item Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100 rounded-lg"
            >
              <X className="size-8 text-gray-500" />
            </Button>
          </DialogHeader>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Item Image & Name */}
              <div className="mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-5xl">
                    {item.itemImage}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                      {item.itemName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.id || item.orderId || "N/A"}
                    </p>

                    {item.status && (
                      <Badge
                        className={`mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                          item.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : item.status === "In Shipment"
                              ? "bg-purple-100 text-purple-700"
                              : item.status === "Shipment Booked"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "Awaiting Guest Payment"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Business Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Business Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {item.business || "N/A"}
                      </p>
                    </div>
                    {item.businessLocation && (
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.businessLocation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guest Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Guest Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Guest Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {item.guestName || "N/A"}
                      </p>
                    </div>
                    {item.guestEmail && (
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.guestEmail}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Found Location */}
                {item.foundLocation && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Found Location
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.foundLocation}
                        </p>
                      </div>
                      {item.foundDate && (
                        <div>
                          <p className="text-xs text-gray-500">Found Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {item.foundDate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping Details */}
                {(item.courier || item.trackingId) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Shipping Details
                    </h4>
                    <div className="space-y-2">
                      {item.courier && (
                        <div>
                          <p className="text-xs text-gray-500">Courier</p>
                          <p className="text-sm font-medium text-gray-900">
                            {item.courier}
                          </p>
                        </div>
                      )}
                      {item.trackingId && (
                        <div>
                          <p className="text-xs text-gray-500">Tracking ID</p>
                          <p className="text-sm font-medium text-blue-600">
                            {item.trackingId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Category */}
                {item.category && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Item Category
                    </h4>
                    <div className="flex items-center gap-2">
                      {item.categoryIcon && (
                        <span className="text-2xl">{item.categoryIcon}</span>
                      )}
                      <p className="text-sm font-medium text-gray-900">
                        {item.category}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <div className="my-6 bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Status Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Item Found
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.foundDate || item.createdDate || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Guest Notified
                      </p>
                      <p className="text-xs text-gray-500">Awaiting response</p>
                    </div>
                  </div>

                  {item.status === "Delivered" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Delivered
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.completedDate || "Recently"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-gray-200 pt-6">
                <Button
                  // onClick={onViewItems}
                  className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  View All Items
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  // onClick={onManage}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Manage Business
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
