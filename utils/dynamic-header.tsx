// "use client";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { menuItems, useUserRole } from "@/config/menuConfig";
// import { ChevronDown, Camera, Edit, LogOut } from "lucide-react";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { useGetCurrentUserQuery, useUpdateUserProfileMutation } from "@/redux/features/user/userApi";
// import { logout } from "@/redux/features/auth/authSlice";
// import { useDispatch } from "react-redux";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { toast } from "sonner";

// function getPageTitle(pathname: string): string {
//     const { role } = useUserRole();
//     const items = menuItems[role];

//     const exactMatch = items.find((item) => item.url === pathname);
//     if (exactMatch) return exactMatch.title;

//     const nestedMatch = items.find((item) => item.url !== "/dashboard" && pathname.startsWith(item.url));
//     if (nestedMatch) return nestedMatch.title;

//     if (pathname.startsWith("/dashboard/")) {
//         const dashboardItem = items.find((item) => item.url === "/dashboard");
//         return dashboardItem?.title || "Dashboard";
//     }

//     return "Overview";
// }

// export function DynamicHeader() {
//     const { data: profileResponse, isLoading, refetch } = useGetCurrentUserQuery(undefined);
//     const [updateProfile] = useUpdateUserProfileMutation();
//     const dispatch = useDispatch();
//     const pathname = usePathname();
//     const pageTitle = getPageTitle(pathname);

//     // Modal states
//     const [photoModalOpen, setPhotoModalOpen] = useState(false);
//     const [nameModalOpen, setNameModalOpen] = useState(false);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [previewUrl, setPreviewUrl] = useState<string>("");
//     const [nameForm, setNameForm] = useState({
//         firstName: "",
//         lastName: "",
//     });

//     // Extract user data from response
//     const myProfile = profileResponse?.data;

//     // Generate user initials
//     const getUserInitials = () => {
//         if (!myProfile?.firstName && !myProfile?.lastName) return "U";
//         const first = myProfile.firstName?.charAt(0) || "";
//         const last = myProfile.lastName?.charAt(0) || "";
//         return (first + last).toUpperCase() || "U";
//     };

//     const getUserFullName = () => {
//         if (!myProfile) return "Loading...";
//         return `${myProfile.firstName || ""} ${myProfile.lastName || ""}`.trim() || "User";
//     };

//     // Photo change handlers
//     const handleChangePhoto = () => {
//         setPhotoModalOpen(true);
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             // Check file size (5MB max)
//             if (file.size > 5 * 1024 * 1024) {
//                 toast.error("File size should be less than 5MB");
//                 return;
//             }

//             // Check file type
//             if (!file.type.startsWith("image/")) {
//                 toast.error("Please select an image file");
//                 return;
//             }

//             setSelectedFile(file);
//             setPreviewUrl(URL.createObjectURL(file));
//         }
//     };

//     const handleUploadPhoto = async () => {
//         if (!selectedFile) {
//             toast.error("Please select a photo");
//             return;
//         }

//         const toastId = toast.loading("Uploading photo...");

//         try {
//             const formData = new FormData();
//             formData.append("image", selectedFile);

//             // If your API needs additional fields
//             formData.append("_method", "PATCH");

//             const response = await updateProfile(formData).unwrap();

//             if (response.success) {
//                 toast.success("Photo updated successfully!", { id: toastId });
//                 setPhotoModalOpen(false);
//                 setSelectedFile(null);
//                 setPreviewUrl("");
//                 refetch(); // Refetch user data
//             } else {
//                 toast.error(response.message || "Failed to upload photo", { id: toastId });
//             }
//         } catch (error: any) {
//             console.error("Upload error:", error);
//             const errorMessage = error?.data?.message || "Failed to upload photo";
//             toast.error(errorMessage, { id: toastId });
//         }
//     };

//     // Name change handlers
//     const handleChangeName = () => {
//         setNameForm({
//             firstName: myProfile?.firstName || "",
//             lastName: myProfile?.lastName || "",
//         });
//         setNameModalOpen(true);
//     };

//     const handleUpdateName = async () => {
//         if (!nameForm.firstName.trim()) {
//             toast.error("First name is required");
//             return;
//         }

//         const toastId = toast.loading("Updating profile...");

//         try {
//             const response = await updateProfile({
//                 firstName: nameForm.firstName,
//                 lastName: nameForm.lastName,
//             }).unwrap();

//             if (response.success) {
//                 toast.success("Profile updated successfully!", { id: toastId });
//                 setNameModalOpen(false);
//                 refetch(); // Refetch user data
//             } else {
//                 toast.error(response.message || "Failed to update profile", { id: toastId });
//             }
//         } catch (error: any) {
//             console.error("Update error:", error);
//             toast.error(error?.data?.message || "Failed to update profile", { id: toastId });
//         }
//     };

//     const handleLogout = () => {
//         dispatch(logout());
//         toast.success("Logged out successfully");
//     };

//     // Clean up preview URL
//     const closePhotoModal = () => {
//         if (previewUrl) {
//             URL.revokeObjectURL(previewUrl);
//         }
//         setPhotoModalOpen(false);
//         setSelectedFile(null);
//         setPreviewUrl("");
//     };

//     return (
//         <>
//             <div className="shrink-0 flex items-center justify-between gap-2 p-[22px] bg-[#0096FF] shadow-[0px_1px_16px_0px_rgba(0,0,0,0.08)] border-b">
//                 <div className="flex items-center gap-2">
//                     <SidebarTrigger className="block md:hidden text-white" />
//                     <h1 className="text-[20px] font-bold text-[#ffffff]">{pageTitle}</h1>
//                 </div>

//                 <div suppressHydrationWarning>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
//                                 {/* Avatar */}
//                                 {myProfile?.image && myProfile.image !== "" ? (
//                                     <img
//                                         src={`${process.env.NEXT_PUBLIC_BASEURL}${myProfile.image}`}
//                                         alt="User Avatar"
//                                         className="rounded-full h-14 w-14 border-2 border-white object-cover"
//                                         onError={(e) => {
//                                             // Hide broken image and show avatar
//                                             e.currentTarget.style.display = "none";
//                                             const avatarDiv = e.currentTarget.nextElementSibling as HTMLElement;
//                                             if (avatarDiv) avatarDiv.style.display = "flex";
//                                         }}
//                                     />
//                                 ) : null}

//                                 {/* Avatar fallback - shown when no image or image fails */}
//                                 <div className={`rounded-full h-14 w-14 border-2 border-white bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center ${myProfile?.image && myProfile.image !== "" ? "hidden" : ""}`}>
//                                     <span className="text-white text-2xl font-bold">{getUserInitials()}</span>
//                                 </div>

//                                 <div>
//                                     <p className="text-white text-2xl mb-0 font-medium">{isLoading ? "Loading..." : getUserFullName()}</p>
//                                     <p className="text-white text-[14px] mb-0 font-medium capitalize">{myProfile?.role || "User"}</p>
//                                 </div>
//                                 <div>
//                                     <ChevronDown className="text-2xl text-white" />
//                                 </div>
//                             </div>
//                         </DropdownMenuTrigger>

//                         <DropdownMenuContent className="w-56 mr-4 bg-white">
//                             <DropdownMenuLabel className="font-normal">
//                                 <div className="flex flex-col space-y-1">
//                                     <p className="text-sm font-medium leading-none">{getUserFullName()}</p>
//                                     <p className="text-xs leading-none text-muted-foreground">{myProfile?.email || "No email"}</p>
//                                 </div>
//                             </DropdownMenuLabel>

//                             <DropdownMenuSeparator />

//                             <DropdownMenuItem onClick={handleChangePhoto} className="cursor-pointer flex items-center gap-2" disabled={isLoading}>
//                                 <Camera className="h-4 w-4" />
//                                 <span>Change Photo</span>
//                             </DropdownMenuItem>

//                             <DropdownMenuItem onClick={handleChangeName} className="cursor-pointer flex items-center gap-2" disabled={isLoading}>
//                                 <Edit className="h-4 w-4" />
//                                 <span>Change Name</span>
//                             </DropdownMenuItem>

//                             <DropdownMenuSeparator />

//                             <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600" disabled={isLoading}>
//                                 <LogOut className="h-4 w-4" />
//                                 <span>Logout</span>
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </div>

//             {/* Photo Change Modal */}
//             <Dialog open={photoModalOpen} onOpenChange={closePhotoModal}>
//                 <DialogContent className="w-96">
//                     <DialogHeader>
//                         <DialogTitle>Change Profile Photo</DialogTitle>
//                     </DialogHeader>

//                     <div className="space-y-4">
//                         <div className="flex justify-center">
//                             {previewUrl ? (
//                                 <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-2 border-gray-300" />
//                             ) : myProfile?.image ? (
//                                 <img src={`${process.env.NEXT_PUBLIC_BASEURL}${myProfile.image}`} alt="Current" className="w-32 h-32 rounded-full object-cover border-2 border-gray-300" />
//                             ) : (
//                                 <div className="w-32 h-32 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
//                                     <span className="text-white text-3xl font-bold">{getUserInitials()}</span>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="photo">Select new photo</Label>
//                             <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
//                             <p className="text-xs text-gray-500">Max 5MB</p>
//                         </div>
//                     </div>

//                     <DialogFooter className="gap-2">
//                         <Button variant="outline" onClick={closePhotoModal}>
//                             Cancel
//                         </Button>
//                         <Button onClick={handleUploadPhoto} disabled={!selectedFile}>
//                             Upload
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Name Change Modal */}
//             <Dialog open={nameModalOpen} onOpenChange={setNameModalOpen}>
//                 <DialogContent className="w-96">
//                     <DialogHeader>
//                         <DialogTitle>Update Name</DialogTitle>
//                     </DialogHeader>

//                     <div className="space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="firstName">First Name</Label>
//                                 <Input id="firstName" value={nameForm.firstName} onChange={(e) => setNameForm({ ...nameForm, firstName: e.target.value })} placeholder="First name" />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="lastName">Last Name</Label>
//                                 <Input id="lastName" value={nameForm.lastName} onChange={(e) => setNameForm({ ...nameForm, lastName: e.target.value })} placeholder="Last name" />
//                             </div>
//                         </div>
//                     </div>

//                     <DialogFooter className="gap-2">
//                         <Button variant="outline" onClick={() => setNameModalOpen(false)}>
//                             Cancel
//                         </Button>
//                         <Button onClick={handleUpdateName} disabled={!nameForm.firstName.trim()}>
//                             Update
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { menuItems, useUserRole } from "@/config/menuConfig";
import { ChevronDown, Camera, Edit, LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
} from "@/redux/features/user/userApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

/* ----------------------------------------
   PURE FUNCTION (NO HOOKS HERE)
----------------------------------------- */
function getPageTitle(pathname: string, role: keyof typeof menuItems): string {
  const items = menuItems[role] ?? [];

  const exactMatch = items.find((item) => item.url === pathname);
  if (exactMatch) return exactMatch.title;

  const nestedMatch = items.find(
    (item) => item.url !== "/dashboard" && pathname.startsWith(item.url),
  );
  if (nestedMatch) return nestedMatch.title;

  if (pathname.startsWith("/dashboard")) {
    const dashboardItem = items.find((item) => item.url === "/dashboard");
    return dashboardItem?.title || "Dashboard";
  }

  return "Overview";
}

/* ----------------------------------------
   COMPONENT
----------------------------------------- */
export function DynamicHeader() {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const { role } = useUserRole(); // ✅ hook used correctly
  const pageTitle = getPageTitle(pathname, role);

  const {
    data: profileResponse,
    isLoading,
    refetch,
  } = useGetCurrentUserQuery(undefined);
  const [updateProfile] = useUpdateUserProfileMutation();

  const myProfile = profileResponse?.data;

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [nameForm, setNameForm] = useState({
    firstName: "",
    lastName: "",
  });

  const getUserInitials = () => {
    if (!myProfile?.firstName && !myProfile?.lastName) return "U";
    return `${myProfile?.firstName?.[0] ?? ""}${myProfile?.lastName?.[0] ?? ""}`.toUpperCase();
  };

  const getUserFullName = () =>
    `${myProfile?.firstName ?? ""} ${myProfile?.lastName ?? ""}`.trim() ||
    "User";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;

    const toastId = toast.loading("Uploading photo...");
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("_method", "PATCH");

      const res = await updateProfile(formData).unwrap();
      if (res.success) {
        toast.success("Photo updated", { id: toastId });
        setPhotoModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl("");
        refetch();
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Upload failed", {
        id: toastId,
      });
    }
  };

  const handleUpdateName = async () => {
    if (!nameForm.firstName.trim()) return;

    const toastId = toast.loading("Updating profile...");
    try {
      const res = await updateProfile(nameForm).unwrap();
      if (res.success) {
        toast.success("Profile updated", { id: toastId });
        setNameModalOpen(false);
        refetch();
      } else {
        toast.error(res.message, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed", {
        id: toastId,
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 md:p-4 bg-[#0096FF] border-b">
        <div className="flex items-center gap-2">
          {/* <SidebarTrigger className="md:hidden text-white">
                        <Menu className="h-6 w-6" />
                    </SidebarTrigger> */}
          <div className="relative">
            <SidebarTrigger className="text-white opacity-0" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-5 flex flex-col gap-1.5">
                <div className="h-0.5 w-full bg-white rounded-full"></div>
                <div className="h-0.5 w-4/5 bg-white rounded-full ml-auto"></div>
                <div className="h-0.5 w-3/5 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white">{pageTitle}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              {myProfile?.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BASEURL}${myProfile.image}`}
                  className="h-14 w-14 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {getUserInitials()}
                  </span>
                </div>
              )}

              <div className="hidden md:block">
                <p className="text-white text-lg font-medium">
                  {isLoading ? "Loading..." : getUserFullName()}
                </p>
                <p className="text-white text-sm capitalize">
                  {myProfile?.role}
                </p>
              </div>

              <ChevronDown className="text-white hidden md:block" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => setPhotoModalOpen(true)}>
              <Camera className="w-4 h-4 mr-2" /> Change Photo
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setNameForm({
                  firstName: myProfile?.firstName || "",
                  lastName: myProfile?.lastName || "",
                });
                setNameModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" /> Change Name
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Photo Modal */}
      <Dialog open={photoModalOpen} onOpenChange={setPhotoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Photo</DialogTitle>
          </DialogHeader>

          <Input type="file" accept="image/*" onChange={handleFileChange} />

          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadPhoto} disabled={!selectedFile}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Name Modal */}
      <Dialog open={nameModalOpen} onOpenChange={setNameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Name</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="First Name"
            value={nameForm.firstName}
            onChange={(e) =>
              setNameForm({ ...nameForm, firstName: e.target.value })
            }
          />
          <Input
            placeholder="Last Name"
            value={nameForm.lastName}
            onChange={(e) =>
              setNameForm({ ...nameForm, lastName: e.target.value })
            }
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setNameModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateName}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
