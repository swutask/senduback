"use client";

import {
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Info as InfoIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useGetPropertyByIdQuery } from "@/redux/features/property/propertyApi";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";

interface PropertyDetailViewProps {
  propertyId: string;
  onClose: () => void;
}

export function PropertyDetailView({
  propertyId,
  onClose,
}: PropertyDetailViewProps) {
  const { data: response, isLoading } = useGetPropertyByIdQuery(propertyId);

  const propertyData = response?.data;

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden bg-white rounded-xl">
          <div className="flex items-center justify-center p-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">
                Loading property details...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!propertyData) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6 bg-white rounded-xl">
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <InfoIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Property Not Found
            </h3>
            <p className="text-gray-500 mb-6">
              The property details could not be retrieved.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white rounded-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm">
              {propertyData.propertyImage &&
              propertyData.propertyImage.length > 0 ? (
                <Image
                  src={getImageUrl(propertyData.propertyImage[0])}
                  alt={propertyData.propertyName || "Property"}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {propertyData.propertyName || "Property Details"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-100 px-2.5 py-0.5 font-medium"
                >
                  {propertyData.propertyType || "Business"}
                </Badge>
                <span className="text-xs text-gray-400 font-medium select-none">
                  •
                </span>
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {propertyData.city}, {propertyData.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 border border-gray-100 shadow-sm bg-gray-50/30">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Address Details
              </h4>
              <div className="space-y-4">
                <InfoRow
                  label="Address Line 1"
                  value={propertyData.addressLine1 || "N/A"}
                />
                <InfoRow
                  label="Address Line 2"
                  value={propertyData.addressLine2 || "N/A"}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="City" value={propertyData.city || "N/A"} />
                  <InfoRow
                    label="Postcode"
                    value={propertyData.postcode || "N/A"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Country"
                    value={propertyData.country || "N/A"}
                  />
                  <InfoRow
                    label="Country Code"
                    value={propertyData.countryCode || "N/A"}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-5 border border-gray-100 shadow-sm bg-gray-50/30">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Contact Information
              </h4>
              <div className="space-y-4">
                <InfoRow
                  label="Contact Email"
                  value={propertyData.contactEmail || "N/A"}
                  icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
                />
                <InfoRow
                  label="Contact Phone"
                  value={propertyData.contactPhone || "N/A"}
                  icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
                />

                <h4 className="text-sm font-bold text-gray-900 mb-3 pt-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  System Metadata
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow
                    label="Created At"
                    value={formatDate(propertyData.createdAt)}
                  />
                  <InfoRow
                    label="Updated At"
                    value={formatDate(propertyData.updatedAt)}
                  />
                </div>
                <InfoRow label="Property ID" value={propertyData._id} />
              </div>
            </Card>
          </div>

          {/* Property Image Gallery (if more than 1) */}
          {propertyData.propertyImage &&
            propertyData.propertyImage.length > 1 && (
              <Card className="p-5 border border-gray-100 shadow-sm bg-gray-50/30">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Property Images
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {propertyData.propertyImage.map(
                    (img: string, idx: number) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group cursor-pointer relative"
                      >
                        <Image
                          src={getImageUrl(img)}
                          alt={`Property ${idx + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    ),
                  )}
                </div>
              </Card>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 mt-auto">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- helpers ---------- */

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="group">
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-gray-800 break-all">{value}</p>
      </div>
    </div>
  );
}
