"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  User,
  MapPin,
  Shield,
  Calendar,
  Globe,
  Briefcase,
  CheckCircle,
  XCircle,
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
import React from "react";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";

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

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return null;
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || "";
  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

export default function HotelDetailPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const { data, isLoading, error } = useGetUserByIdQuery(id);

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
              Error Loading Hotel
            </CardTitle>
            <CardDescription>
              The requested hotel could not be found or an error occurred.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Return to Hotels</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = data.data;
  const business = user.businessDetails;
  const logoUrl = business?.logo ? getImageUrl(business.logo) : null;
  const userImageUrl = user.image ? getImageUrl(user.image) : null;

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
              {business?.businessName || "Hotel Details"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Hotel management and business information
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={user.status === "active" ? "default" : "destructive"}
              className="px-3 py-1 text-sm font-medium"
            >
              {user.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
              {user.role.toUpperCase()}
            </Badge>
            <Badge
              variant={user.verified ? "secondary" : "outline"}
              className="px-3 py-1 text-sm font-medium"
            >
              {user.verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User & Business Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo and Basic Info */}
              <div className="flex flex-col md:flex-row gap-6">
                {logoUrl && (
                  <div className="shrink-0">
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <Image
                        src={logoUrl}
                        alt={`${business.businessName} logo`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={true}
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {business.businessName}
                    </h3>
                    <p className="text-muted-foreground">
                      {business.companyName}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Business Email
                        </p>
                        <p className="font-medium">{business.businessEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Business Phone
                        </p>
                        <p className="font-medium">{business.businessPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Persons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Contact Person</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{business.contactPerson}</p>
                    <p className="text-sm text-muted-foreground">
                      Primary Contact
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Manager</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{business.managerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Hotel Manager
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {business.address && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Business Address</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Street Address
                        </p>
                        <p className="font-medium">
                          {business.address.street1}
                        </p>
                        {business.address.street2 && (
                          <p className="font-medium">
                            {business.address.street2}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          City/State
                        </p>
                        <p className="font-medium">{`${business.address.city}, ${business.address.state}`}</p>
                        <p className="text-sm text-muted-foreground">
                          Postal Code
                        </p>
                        <p className="font-medium">
                          {business.address.postal_code}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="font-medium">
                          {business.address.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Country Code
                        </p>
                        <p className="font-medium">
                          {business.address.countryCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* User Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {userImageUrl ? (
                  <div className="shrink-0">
                    <div className="relative w-24 h-24 border rounded-full overflow-hidden">
                      <Image
                        src={userImageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={true}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="shrink-0">
                    <div className="w-24 h-24 border rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-muted-foreground">Account Holder</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Email Address
                      </p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">{user.role.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Timeline */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Account Status</span>
                  <Badge
                    variant={
                      user.status === "active" ? "default" : "destructive"
                    }
                  >
                    {user.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Email Verified</span>
                  <div className="flex items-center gap-2">
                    {user.verified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 font-medium">
                          Unverified
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Account Type</span>
                  <Badge variant="outline">{user.role.toUpperCase()}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">User Created</p>
                  <p className="font-medium text-sm">
                    {formatDateSafely(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-sm">
                    {formatDateSafely(user.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Business Created
                  </p>
                  <p className="font-medium text-sm">
                    {business?.createdAt
                      ? formatDateSafely(business.createdAt)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Business Updated
                  </p>
                  <p className="font-medium text-sm">
                    {business?.updatedAt
                      ? formatDateSafely(business.updatedAt)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business ID Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                IDs & References
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium text-sm font-mono truncate">
                    {user._id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business ID</p>
                  <p className="font-medium text-sm font-mono truncate">
                    {business._id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
