"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Hash,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLostItemByIdQuery } from "@/redux/features/lostItem/lostitemApi";
import React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to safely format dates
const formatDateSafely = (dateString: string | Date) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || "";
  // Remove leading slash if present to avoid double slash
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

export default function LostItemDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const { data, isLoading, error } = useGetLostItemByIdQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Lost Item
            </CardTitle>
            <CardDescription>
              The requested lost item could not be found or an error occurred.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Return to Lost Items</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lostItem = data.data;
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    claimed: "bg-green-100 text-green-800 hover:bg-green-100",
    disposed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };

  // Get full image URLs
  const imageUrls =
    lostItem.images?.map((image: string) => getImageUrl(image)) || [];
  console.log(lostItem.images);
  console.log(imageUrls);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Lost Items
      </Button>

      {/* Single Card View */}
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                {lostItem.itemName}
                <Badge
                  className={`px-3 py-1 text-sm font-medium ${statusColors[lostItem.status] || "bg-gray-100"}`}
                >
                  {lostItem.status.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                Item ID: {lostItem._id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Images Section */}
            {imageUrls.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Item Images ({imageUrls.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imageUrls.map((imageUrl: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border group"
                    >
                      <Image
                        src={imageUrl}
                        alt={`${lostItem.itemName} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                        unoptimized={true}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Item Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Item Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Item Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-base">{lostItem.itemDescription}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Date Found
                          </p>
                          <p className="font-medium">
                            {formatDateSafely(lostItem.dateFound)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Location Found
                          </p>
                          <p className="font-medium">
                            {lostItem.locationFound}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guest Information
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Guest Name
                        </p>
                        <p className="font-medium">{lostItem.guestName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Reservation Name
                        </p>
                        <p className="font-medium">
                          {lostItem.guestReservationName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Phone
                          </p>
                          <p className="font-medium">{lostItem.guestPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Email
                          </p>
                          <p className="font-medium">{lostItem.guestEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Room Number
                          </p>
                          <p className="font-medium">
                            {lostItem.guestRoomNumber}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Checkout Date
                        </p>
                        <p className="font-medium">
                          {formatDateSafely(lostItem.checkoutDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Information */}
              <div className="space-y-4">
                {/* Business Information */}
                {lostItem.user?.businessDetails && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Business Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Business Name
                        </p>
                        <p className="font-medium">
                          {lostItem.user.businessDetails.businessName}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Contact Person
                          </p>
                          <p className="font-medium">
                            {lostItem.user.businessDetails.contactPerson}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Business Phone
                          </p>
                          <p className="font-medium">
                            {lostItem.user.businessDetails.businessPhone}
                          </p>
                        </div>
                      </div>
                      {lostItem.user.businessDetails.address && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Address
                          </p>
                          <p className="font-medium">{`${lostItem.user.businessDetails.address.street1}, ${lostItem.user.businessDetails.address.city}`}</p>
                          <p className="font-medium">{`${lostItem.user.businessDetails.address.state}, ${lostItem.user.businessDetails.address.country}`}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {lostItem.note && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Additional Notes
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-base">{lostItem.note}</p>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-lg mb-3">Record Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Created
                      </span>
                      <span className="text-sm font-medium">
                        {formatDateSafely(lostItem.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Updated
                      </span>
                      <span className="text-sm font-medium">
                        {formatDateSafely(lostItem.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
