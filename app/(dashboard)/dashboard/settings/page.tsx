// "use client";

// import { useGetCurrentUserQuery, useUpdateUserProfileMutation } from "@/redux/features/user/userApi";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { useAppSelector } from "@/redux/hook";
// import { selectCurrentUser } from "@/redux/features/auth/authSlice";

// type SettingsFormValues = {
//     businessName: string;
//     email: string;
//     phone: string;
// };

// export default function SettingsPage() {
//     const user = useAppSelector(selectCurrentUser);
//     console.log(user);

//     const { data: userResponse, isLoading: isFetching } = useGetCurrentUserQuery({});
//     const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         reset,
//         formState: { isDirty },
//     } = useForm<SettingsFormValues>({
//         defaultValues: {
//             businessName: "",
//             email: "",
//             phone: "",
//         },
//     });

//     useEffect(() => {
//         if (userResponse?.data) {
//             const user = userResponse.data;
//             reset({
//                 businessName: user.businessDetails?.businessName || "",
//                 email: user.email || "",
//                 phone: user.businessDetails?.telephone || "",
//             });
//         }
//     }, [userResponse, reset]);

//     const onSubmit = async (data: SettingsFormValues) => {
//         const toastId = toast.loading("Updating settings...");
//         try {
//             const response = await updateUserProfile({
//                 businessDetails: {
//                     businessName: data.businessName,
//                     telephone: data.phone,
//                 },
//             }).unwrap();

//             if (response.success) {
//                 toast.success("Settings updated successfully!", { id: toastId });
//             }
//         } catch (error: any) {
//             toast.error(error?.data?.message || "Failed to update settings", { id: toastId });
//         }
//     };

//     return (
//         <div className="max-w-5xl">
//             <h1 className="text-2xl font-semibold mb-6">Settings</h1>

//             <Card className="max-w-2xl">
//                 <CardHeader>
//                     <CardTitle className="text-base font-medium">Account Settings</CardTitle>
//                 </CardHeader>

//                 <CardContent>
//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                         {/* Account Name */}
//                         <div className="space-y-2">
//                             <Label>Business Name</Label>
//                             <Input {...register("businessName")} />
//                         </div>

//                         {/* Email */}
//                         <div className="space-y-1">
//                             <Label>Primary Contact Email</Label>
//                             <Input type="email" {...register("email")} readOnly />

//                             <p className="text-xs text-muted-foreground">Used for customer communication</p>
//                         </div>

//                         {/* Phone */}
//                         <div className="space-y-2">
//                             <Label>Primary Contact Phone</Label>
//                             <div className="flex gap-2 items-center">
//                                 <Select defaultValue="+1">
//                                     <SelectTrigger className="w-[90px] h-full!">
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="+1">🇺🇸 +1</SelectItem>
//                                         <SelectItem value="+44">🇬🇧 +44</SelectItem>
//                                         <SelectItem value="+91">🇮🇳 +91</SelectItem>
//                                     </SelectContent>
//                                 </Select>

//                                 <Input className="flex-1" placeholder="555-0100" {...register("phone")} />
//                             </div>
//                         </div>

//                         {/* Save Button */}
//                         <div className="flex justify-end pt-4">
//                             <Button type="submit" disabled={!isDirty || isUpdating} className="px-6">
//                                 {isUpdating ? "Saving..." : "Save Changes"}
//                             </Button>
//                         </div>
//                     </form>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

"use client";

import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import AdminSettings from "@/components/dashboard/settings/AdminSettings";
import BusinessSettings from "@/components/dashboard/settings/BusinessSettings";

export default function SettingsPage() {
  const user = useAppSelector(selectCurrentUser);

  // Show loading or nothing while user data loads
  if (!user) {
    return (
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {user.role === "admin" ? (
        <AdminSettings />
      ) : user.role === "business" ? (
        <BusinessSettings />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No settings available for your role.</p>
        </div>
      )}
    </>
  );
}
