"use client";

import Image from "next/image";
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetPropertyByIdQuery } from "@/redux/features/property/propertyApi";
import { ImageOff } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string | null;
}

export default function PropertyModal({ open, onOpenChange, itemId }: Props) {
  const { data, isLoading } = useGetPropertyByIdQuery(itemId || "", {
    skip: !itemId,
  });

  const property = data?.data;

  if (!open) return null;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full md:max-w-3xl h-[60vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:min-w-3xl h-[90vh] overflow-y-auto rounded-xl">
        {/* Header */}
        <div className="py-2 border-b flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold">
            Property Details
          </DialogTitle>
        </div>

        {/* Image */}
        <div className="relative h-56 w-full bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {property.propertyImage?.length ? (
            <Image
              src={getImageUrl(property.propertyImage[0])}
              alt={property.propertyName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <ImageOff size={40} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Property Information */}
          <Section title="Property Information">
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <KeyValue label="Name" value={property.propertyName} />
              <KeyValue label="Type" value={property.propertyType} />
              <KeyValue
                label="Status"
                value={<span className="text-green-600">Active</span>}
              />
              <KeyValue
                label="Default Property"
                value={property.propertyType === "Default" ? "Yes" : "No"}
              />
            </div>
          </Section>

          {/* Address */}
          <Section title="Address">
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-100 p-4 rounded-lg space-y-2">
              {property.addressLine1}
              <br />
              {property.addressLine2 && (
                <>
                  {property.addressLine2}
                  <br />
                </>
              )}
              {property.city}, {property.postcode}
              <br />
              {property.country}
            </p>
          </Section>

          {/* Contact Info */}
          <Section title="Contact Information">
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <KeyValue label="Email" value={property.contactEmail || "—"} />
              <KeyValue label="Phone" value={property.contactPhone || "—"} />
              <KeyValue
                label="Website"
                value={
                  property.website ? (
                    <a
                      href={property.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {property.website}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </div>
          </Section>

          {/* Footer */}
          <div className="space-y-4 pt-4">
            <Button className="w-full h-11 text-base">
              Edit Property Details
            </Button>

            <div className="text-xs text-gray-400 text-right">
              Created: January 15, 2024
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Helper UI ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}:</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}
