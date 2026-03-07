// "use client";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ChevronUp } from "lucide-react";

// const AccountTab = () => {
//     return (
//         <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-0">
//             <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-bold text-[#3A3A3A]">Account details</h2>
//                     <Button variant="ghost" size="sm" className="w-11 h-11 bg-[#E6EAEF] hover:bg-[#E6EAEF]/80 rounded-full flex items-center justify-center p-0">
//                         <ChevronUp className="h-5 w-5 text-[#3A3A3A]" />
//                     </Button>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-2">
//                             <Label htmlFor="name" className="font-bold text-[#3A3A3A] text-base">
//                                 Name
//                             </Label>
//                             <Input id="name" placeholder="Enter your name" className="bg-[#E6EAEF] p-4 h-12 text-base" />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="surname" className="font-bold text-[#3A3A3A] text-base">
//                                 Surname
//                             </Label>
//                             <Input id="surname" placeholder="Enter your surname" className="bg-[#E6EAEF] p-4 h-12 text-base" />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="email" className="font-bold text-[#3A3A3A] text-base">
//                                 Email
//                             </Label>
//                             <Input id="email" type="email" placeholder="Enter your email" className="bg-[#E6EAEF] p-4 h-12 text-base" />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="manager" className="font-bold text-[#3A3A3A] text-base">
//                                 Manager name
//                             </Label>
//                             <Input id="manager" placeholder="Enter manager name" className="bg-[#E6EAEF] p-4 h-12 text-base" />
//                         </div>
//                     </div>
//                     <div className="flex justify-end">
//                         <Button className="bg-[#0096FF] text-white px-8 py-3 text-base">Save changes</Button>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default AccountTab;

"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Camera } from "lucide-react";
import {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
} from "@/redux/features/user/userApi";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";

const AccountTab = () => {
  const { data, refetch } = useGetCurrentUserQuery({});
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const userData = data?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      });
    }
  }, [userData]);

  // Generate user initials
  const getUserInitials = () => {
    if (!userData?.firstName && !userData?.lastName) return "U";
    const first = userData.firstName?.charAt(0) || "";
    const last = userData.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      // Auto upload the file
      handleUploadPhoto(file);
    }
  };

  const handleUploadPhoto = async (file?: File) => {
    const fileToUpload = file || selectedFile;
    if (!fileToUpload) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      const formData = new FormData();
      formData.append("image", fileToUpload);

      const response = await updateUserProfile(formData).unwrap();

      if (response.success) {
        toast.success("Photo updated successfully!", { id: toastId });
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl("");
        }
        refetch();
      } else {
        toast.error(response.message || "Failed to upload photo", {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload photo", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      await updateUserProfile(updateData).unwrap();
      toast.success("Profile updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-0">
      <CardContent className="p-6">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h2 className="text-xl font-bold text-[#3A3A3A]">Account details</h2>
          <div className="w-11 h-11 bg-[#E6EAEF] hover:bg-[#E6EAEF]/80 rounded-full flex items-center justify-center p-0">
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5 text-[#3A3A3A]" />
            ) : (
              <ChevronUp className="h-5 w-5 text-[#3A3A3A]" />
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="space-y-6 mt-6">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200">
              <div className="relative">
                {userData?.image || previewUrl ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={
                        previewUrl ||
                        `${process.env.NEXT_PUBLIC_BASEURL}${userData?.image}`
                      }
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-3xl font-bold">
                      {getUserInitials()}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-2 right-2 bg-[#0096FF] text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#3A3A3A]">
                  {userData?.firstName || ""} {userData?.lastName || ""}
                </h3>
                <p className="text-sm text-gray-500">
                  Click camera icon to change photo
                </p>
              </div>
            </div>

            {/* Form Fields - Only First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="font-bold text-[#3A3A3A] text-base"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter your first name"
                  className="bg-[#E6EAEF] p-4 h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="font-bold text-[#3A3A3A] text-base"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter your last name"
                  className="bg-[#E6EAEF] p-4 h-12 text-base"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-[#0096FF] text-white px-8 py-3 text-base"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountTab;
