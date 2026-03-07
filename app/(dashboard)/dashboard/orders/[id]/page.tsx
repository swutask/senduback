"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  Truck,
  Home,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  FileText,
  Calendar,
  Shield,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useGetShippingByIdQuery } from "@/redux/features/shipping/shippingApi";
import React, { useState } from "react";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const formatDateSafely = (dateString: string | Date) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "MMM dd, yyyy, h:mm a");
  } catch {
    return "Invalid date";
  }
};

const formatCurrency = (amount: number, currency?: string) => {
  const currencyCode = currency || "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
};

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || "";
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "paymentcompleted":
      return "Paid";
    case "shipped":
      return "Shipped";
    case "rateselected":
      return "Awaiting Payment";
    case "created":
      return "Pending";
    default:
      return status;
  }
};

const getStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "shipped":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    case "paymentcompleted":
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
    case "rateselected":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
    case "created":
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
  }
};

export default function OrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const { data, isLoading, error } = useGetShippingByIdQuery(id);

  const [isDownloading, setIsDownloading] = useState(false);

  // Function to handle download
  const handleDownloadLabel = async () => {
    if (!shippingLabelUrl) return;

    setIsDownloading(true);
    try {
      const response = await fetch(shippingLabelUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shipping-label-${shipping._id.slice(-8)}.${shippingLabelUrl.split(".").pop() || "png"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(shippingLabelUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Order
            </CardTitle>
            <CardDescription>
              The requested order could not be found or an error occurred.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Return to Orders</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shipping = data.data;

  // Get shipping label URL
  const shippingLabelUrl = shipping.shippingLabel
    ? getImageUrl(shipping.shippingLabel)
    : null;

  // Calculate service cost
  const serviceCost =
    shipping.total_cost -
    (shipping.shipping_cost || 0) -
    (shipping.insurance?.insuranceCost || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Shipping Order #{shipping._id.slice(-8)}
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete shipping details and tracking information
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm font-medium ${getStatusClasses(shipping.status)}`}
            >
              {getStatusText(shipping.status)}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
              {shipping.zoneName.toUpperCase()} Zone
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Shipping Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Sender</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{shipping.address_from.name}</p>
                    <p className="text-sm">{shipping.address_from.street1}</p>
                    <p className="text-sm">{`${shipping.address_from.city}, ${shipping.address_from.state} ${shipping.address_from.postal_code}`}</p>
                    <p className="text-sm">
                      {shipping.address_from.countryName}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">{shipping.address_from.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">{shipping.address_from.email}</p>
                    </div>
                  </div>
                </div>

                {/* Receiver */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Receiver</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{shipping.address_to.name}</p>
                    <p className="text-sm">{shipping.address_to.street1}</p>
                    <p className="text-sm">{`${shipping.address_to.city}, ${shipping.address_to.state} ${shipping.address_to.postal_code}`}</p>
                    <p className="text-sm">{shipping.address_to.countryName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">{shipping.address_to.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">{shipping.address_to.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Parcels ({shipping.parcel.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipping.parcel.map((parcel: any, index: number) => (
                  <div key={parcel._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{parcel.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {parcel.itemType}
                        </p>
                      </div>
                      <Badge variant="outline">Item {index + 1}</Badge>
                    </div>
                    <p className="text-sm mb-3">{parcel.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Dimensions
                        </p>
                        <p className="font-medium text-sm">{`${parcel.length}×${parcel.width}×${parcel.height} ${parcel.distance_unit}`}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="font-medium text-sm">{`${parcel.weight} ${parcel.mass_unit}`}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium text-sm">{parcel.itemType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Tracking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking ID</p>
                  <p className="font-medium">
                    {shipping.tracking_id || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carrier</p>
                  <p className="font-medium">
                    {shipping.carrier || "Not specified"}
                  </p>
                </div>
                {shipping.tracking_url && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tracking URL
                    </p>
                    <a
                      href={shipping.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {shipping.tracking_url}
                    </a>
                  </div>
                )}
              </div>

              {/* Shipping Label */}
              {shippingLabelUrl && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Shipping Label</p>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-4/3">
                      <Image
                        src={shippingLabelUrl}
                        alt="Shipping Label"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={true}
                      />
                    </div>
                    <div className="p-3 bg-gray-50 border-t flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadLabel}
                        disabled={isDownloading}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        {isDownloading ? "Downloading..." : "Download Label"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-medium text-sm font-mono">{shipping._id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium text-sm">
                  {formatDateSafely(shipping.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium text-sm">
                  {formatDateSafely(shipping.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zone</p>
                <p className="font-medium text-sm">
                  {shipping.zoneName.toUpperCase()}
                </p>
              </div>
              {shipping.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium text-sm">{shipping.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
