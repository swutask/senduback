// "use client";
// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import Image from "next/image";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useUpdateBusinessDetailsMutation } from "@/redux/features/business/businessApi";
// import { useGetCurrentUserQuery } from "@/redux/features/user/userApi";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// const BusinessSettingsContent = () => {
//     const router = useRouter();
//     const [collapsedSections, setCollapsedSections] = useState({
//         businessDetails: false,
//         addressDetails: true,
//         invoicingDetails: true,
//         inviteMembers: true,
//         packagingKit: true,
//         prohibitedItems: true,
//     });

//     const toggleSection = (section: string) => {
//         setCollapsedSections((prev) => ({
//             ...prev,
//             [section]: !prev[section as keyof typeof prev],
//         }));
//     };

//     const { data: userData } = useGetCurrentUserQuery({});
//     console.log(userData);
//     const businessDetails = userData?.data?.businessDetails;

//     const [updateBusinessDetails, { isLoading }] = useUpdateBusinessDetailsMutation();

//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//     const [logoFile, setLogoFile] = useState<File | null>(null);

//     const [formData, setFormData] = useState({
//         businessName: "",
//         businessPhone: "",
//         businessEmail: "",
//         contactPerson: "",
//         managerName: "",
//         companyName: "",
//         address: {
//             street1: "",
//             street2: "",
//             city: "",
//             state: "",
//             postal_code: "",
//             country: "",
//         },
//     });

//     const [addressForm, setAddressForm] = useState({
//         companyName: "",
//         companyPhone: "",
//         companyScope: "",
//         taxOffice: "",
//         vatNumber: "",
//         address: "",
//         city: "",
//         postalCode: "",
//         country: "",
//         invoicingEmail: "",
//     });

//     const [invoicingForm, setInvoicingForm] = useState({
//         taxID: "",
//         vatNumber: "",
//     });

//     useEffect(() => {
//         if (businessDetails) {
//             setFormData({
//                 businessName: businessDetails.businessName || "",
//                 businessPhone: businessDetails.businessPhone || "",
//                 businessEmail: businessDetails.businessEmail || "",
//                 contactPerson: businessDetails.contactPerson || "",
//                 managerName: businessDetails.managerName || "",
//                 companyName: businessDetails.companyName || "",
//                 address: businessDetails.address || {
//                     street1: "",
//                     street2: "",
//                     city: "",
//                     state: "",
//                     postal_code: "",
//                     country: "",
//                 },
//             });

//             setAddressForm({
//                 companyName: businessDetails.companyName || "",
//                 companyPhone: businessDetails.businessPhone || "",
//                 companyScope: "",
//                 taxOffice: "",
//                 vatNumber: "",
//                 address: `${businessDetails.address?.street1 || ""} ${businessDetails.address?.street2 || ""}`.trim(),
//                 city: businessDetails.address?.city || "",
//                 postalCode: businessDetails.address?.postal_code || "",
//                 country: businessDetails.address?.country || "",
//                 invoicingEmail: businessDetails.businessEmail || "",
//             });

//             if (businessDetails.logo) {
//                 if (businessDetails.logo.startsWith("http")) {
//                     setPreviewUrl(businessDetails.logo);
//                 } else {
//                     setPreviewUrl(`${process.env.NEXT_PUBLIC_BASEURL}${businessDetails.logo}`);
//                 }
//             }
//         }
//     }, [businessDetails]);

//     const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
//                 toast.error("Please upload a PNG or JPEG image");
//                 return;
//             }
//             setLogoFile(file);
//             const previewURL = URL.createObjectURL(file);
//             setPreviewUrl(previewURL);
//         }
//     };

//     const handleSaveBusiness = async () => {
//         try {
//             const formDataToSend = new FormData();
//             if (logoFile) {
//                 formDataToSend.append("logo", logoFile);
//             }

//             const businessData = {
//                 businessName: formData.businessName,
//                 businessPhone: formData.businessPhone,
//                 businessEmail: formData.businessEmail,
//                 contactPerson: formData.contactPerson,
//                 managerName: formData.managerName,
//                 companyName: formData.companyName,
//                 address: formData.address,
//             };

//             formDataToSend.append("data", JSON.stringify(businessData));

//             const result = await updateBusinessDetails(formDataToSend).unwrap();
//             console.log(result);
//             toast.success("Business details saved successfully");

//             // Close Business Details and open Address Details
//             setCollapsedSections({
//                 businessDetails: true,
//                 addressDetails: false,
//                 invoicingDetails: true,
//                 inviteMembers: true,
//                 packagingKit: true,
//                 prohibitedItems: true,
//             });
//         } catch (error) {
//             toast.error("Failed to save business details");
//         }
//     };

//     const clearPreview = () => {
//         if (previewUrl) URL.revokeObjectURL(previewUrl);
//         setPreviewUrl(null);
//         setLogoFile(null);
//     };

//     const handleSaveAddress = async () => {
//         try {
//             const updatedAddress = {
//                 street1: addressForm.address.split(",")[0]?.trim() || "",
//                 street2: addressForm.address.split(",")[1]?.trim() || "",
//                 city: addressForm.city,
//                 state: addressForm.city, // Assuming state same as city
//                 postal_code: addressForm.postalCode,
//                 country: addressForm.country,
//             };

//             const formDataToSend = new FormData();
//             const businessData = {
//                 businessName: formData.businessName,
//                 businessPhone: addressForm.companyPhone,
//                 businessEmail: addressForm.invoicingEmail,
//                 contactPerson: formData.contactPerson,
//                 managerName: formData.managerName,
//                 companyName: addressForm.companyName,
//                 address: updatedAddress,
//             };

//             formDataToSend.append("data", JSON.stringify(businessData));

//             await updateBusinessDetails(formDataToSend).unwrap();
//             toast.success("Address details saved successfully");

//             // Close Address Details after saving
//             setCollapsedSections((prev) => ({
//                 ...prev,
//                 addressDetails: true,
//             }));
//             router.push("/dashboard");
//         } catch (error) {
//             toast.error("Failed to save address details");
//         }
//     };

//     return (
//         <div className="space-y-4">
//             {/* Business Details */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-0">
//                 <CardContent className="p-6">
//                     <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("businessDetails")}>
//                         <h3 className="text-lg font-semibold text-[#3A3A3A]">Business details</h3>
//                         <div className="w-11 h-11 bg-[#E6EAEF] hover:bg-[#E6EAEF]/80 rounded-full flex items-center justify-center p-0">{collapsedSections.businessDetails ? <ChevronDown className="h-5 w-5 text-[#3A3A3A]" /> : <ChevronUp className="h-5 w-5 text-[#3A3A3A]" />}</div>
//                     </div>
//                     {!collapsedSections.businessDetails && (
//                         <div className="mt-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//                                 <div className="flex gap-6 items-start">
//                                     <div className="w-32 h-32 bg-[#E6EAEF] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
//                                         {previewUrl ? <Image src={previewUrl} alt="Business Logo Preview" width={128} height={128} className="object-cover w-full h-full" unoptimized={true} /> : <Image src="/dashboard/business/upload.svg" alt="Upload placeholder" width={48} height={48} className="opacity-50" />}
//                                     </div>
//                                     <div className="flex-1 space-y-4">
//                                         <p className="text-sm text-[#3A3A3A]">You can upload your own logo to help users identify your business.</p>
//                                         <div className="text-xs text-[#7C8493] space-y-1">
//                                             <p>• Max logo dimensions 200x200px</p>
//                                             <p>• Logo must be in png or jpeg format</p>
//                                         </div>
//                                         <div>
//                                             <input type="file" id="logo-upload" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleLogoUpload} />
//                                             <label htmlFor="logo-upload" className="cursor-pointer">
//                                                 <div className="bg-[#0096FF] text-white py-3 px-12 rounded text-center hover:bg-blue-600 transition-colors w-fit">Upload logo</div>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-6">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="businessName">Business Name</Label>
//                                         <Input id="businessName" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="businessPhone">Business Phone Number</Label>
//                                         <Input id="businessPhone" value={formData.businessPhone} onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="businessEmail">Business Email Address</Label>
//                                         <Input id="businessEmail" type="email" value={formData.businessEmail} onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="contactPerson">Contact Person (Full Name)</Label>
//                                         <Input id="contactPerson" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="managerName">Manager Name</Label>
//                                         <Input id="managerName" value={formData.managerName} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="companyName">Company Name</Label>
//                                         <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                     <div className="flex items-center justify-end">
//                                         <Button onClick={handleSaveBusiness} disabled={isLoading} className="bg-[#0096FF] text-white py-2 px-10 rounded hover:bg-blue-600 transition-colors">
//                                             {isLoading ? "Saving..." : "Save changes"}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* Address Details */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-0">
//                 <CardContent className="p-6">
//                     <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("addressDetails")}>
//                         <h3 className="text-lg font-semibold text-[#3A3A3A]">Address details</h3>
//                         <div className="w-11 h-11 bg-[#E6EAEF] hover:bg-[#E6EAEF]/80 rounded-full flex items-center justify-center p-0">{collapsedSections.addressDetails ? <ChevronDown className="h-5 w-5 text-[#3A3A3A]" /> : <ChevronUp className="h-5 w-5 text-[#3A3A3A]" />}</div>
//                     </div>
//                     {!collapsedSections.addressDetails && (
//                         <div className="space-y-4 mt-4">
//                             <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4">You can view but not change your business's address details. If you want something changed, contact our support and we will make the change for you.</div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="companyName">Company name</Label>
//                                     <Input id="companyName" value={addressForm.companyName} onChange={(e) => setAddressForm({ ...addressForm, companyName: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="companyPhone">Company phone</Label>
//                                     <Input id="companyPhone" value={addressForm.companyPhone} onChange={(e) => setAddressForm({ ...addressForm, companyPhone: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="address">Address</Label>
//                                     <Input id="address" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="city">City</Label>
//                                         <Input id="city" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="postalCode">ZIP / Postal Code</Label>
//                                         <Input id="postalCode" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                     </div>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="country">Country</Label>
//                                     <Input id="country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="invoicingEmail">Invoicing email</Label>
//                                     <Input id="invoicingEmail" type="email" value={addressForm.invoicingEmail} onChange={(e) => setAddressForm({ ...addressForm, invoicingEmail: e.target.value })} className="bg-[#E6EAEF] p-6" />
//                                 </div>
//                             </div>

//                             <div className="pt-4 flex justify-end items-center">
//                                 <Button onClick={handleSaveAddress} disabled={isLoading} className="bg-[#0096FF] text-white py-2 px-10 rounded hover:bg-blue-600 transition-colors">
//                                     Save changes
//                                 </Button>
//                             </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* Prohibited and Restricted Items */}
//             {/* <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-0">
//                 <CardContent className="p-6">
//                     <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("prohibitedItems")}>
//                         <h3 className="text-lg font-semibold text-[#3A3A3A]">Prohibited and Restricted Items</h3>
//                         <div className="w-11 h-11 bg-[#E6EAEF] hover:bg-[#E6EAEF]/80 rounded-full flex items-center justify-center p-0">{collapsedSections.prohibitedItems ? <ChevronDown className="h-5 w-5 text-[#3A3A3A]" /> : <ChevronUp className="h-5 w-5 text-[#3A3A3A]" />}</div>
//                     </div>
//                     {!collapsedSections.prohibitedItems && (
//                         <div className="mt-4 space-y-6">
//                             <div className="space-y-4">
//                                 <p className="text-[#7C8493] text-sm leading-relaxed">
//                                     All items listed below (or any item similar in content or description) cannot be carried under any circumstance (unless exceptions are specifically noted). Any person sending such an item may have their order cancelled without notice or refund. Items specified as "carried on a no-compensation basis" can be carried at your own risk, but will not be compensated
//                                     whatsoever in the event of loss or damage. Items specified as "restricted for international shipments only" cannot be shipped internationally under any circumstances, but are not restricted for GR domestic shipments.
//                                 </p>

//                                 <p className="text-[#7C8493] text-sm leading-relaxed">
//                                     <strong>IMPORTANT:</strong> This list is not exhaustive, it exists as a rough guide only. Please check our{" "}
//                                     <a href="#" className="text-[#0096FF] hover:underline">
//                                         terms and conditions
//                                     </a>{" "}
//                                     for more accuracy.
//                                 </p>

//                                 <p className="text-[#7C8493] text-sm leading-relaxed">
//                                     Please also check with your carrier for more detailed information:
//                                     <br />
//                                     <a href="#" className="text-[#0096FF] hover:underline">
//                                         UPS – Prohibited items
//                                     </a>
//                                     <br />
//                                     <a href="#" className="text-[#0096FF] hover:underline">
//                                         DHL – Dangerous goods and prohibited items
//                                     </a>
//                                 </p>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label>Search</Label>
//                                 <Input placeholder="Search for prohibited items..." className="bg-[#E6EAEF] p-6" />
//                             </div>

//                             <div className="bg-white border border-gray-200 rounded-lg p-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
//                                     {[
//                                         "Aerosols",
//                                         "Any Items Containing Batteries",
//                                         "Batteries (Not carried via any air service provided)",
//                                         "Nail Varnish",
//                                         "Perfume",
//                                         "Aerosols",
//                                         "After Shave",
//                                         "Aftershave",
//                                         "Air Bags",
//                                         "Airbags",
//                                         "Alcohol",
//                                         "Ammunition",
//                                         "Amp (carried on a no-compensation basis)",
//                                         "Amplifier (carried on a no-compensation basis)",
//                                         "Animals",
//                                         "Antiques (carried on a no-compensation basis)",
//                                         "Any Item Containing Liquids",
//                                         "Any Item With Glass Components (carried on a no-compensation basis)",
//                                         "Archery Equipment",
//                                         "Arms And Ammunition",
//                                         "Arrows",
//                                         "Artworks (Inc Both The Canvas And Frame) (carried on a no-compensation basis)",
//                                         "Beer",
//                                         "Bidets (carried on a no-compensation basis)",
//                                         "Birds",
//                                         "Boat Engines",
//                                         "Bodily Fluids",
//                                         "Boiler",
//                                         "Bomb",
//                                         "Bonds",
//                                         "Books (Not allowed to China)",
//                                         "Bottled Liquids",
//                                         "Bouquets",
//                                         "Bow And Arrow",
//                                         "Bullion",
//                                         "CRT Screens (carried on a no-compensation basis)",
//                                     ].map((item, index) => (
//                                         <div key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded">
//                                             <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
//                                             <span className="text-sm text-gray-700">{item}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card> */}
//         </div>
//     );
// };

// export default BusinessSettingsContent;

"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useUpdateBusinessDetailsMutation } from "@/redux/features/business/businessApi";
import { useGetCurrentUserQuery } from "@/redux/features/user/userApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BusinessSettingsContent = () => {
  const router = useRouter();
  const [collapsedSections, setCollapsedSections] = useState({
    businessDetails: false,
    addressDetails: true,
    invoicingDetails: true,
    inviteMembers: true,
    packagingKit: true,
    prohibitedItems: true,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const { data: userData, refetch: refetchUser } = useGetCurrentUserQuery({});
  console.log(userData);
  const businessDetails = userData?.data?.businessDetails;

  const [updateBusinessDetails, { isLoading }] =
    useUpdateBusinessDetailsMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessPhone: "",
    businessEmail: "",
    contactPerson: "",
    managerName: "",
    companyName: "",
    address: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
  });

  const [addressForm, setAddressForm] = useState({
    companyName: "",
    companyPhone: "",
    companyScope: "",
    taxOffice: "",
    vatNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    invoicingEmail: "",
  });

  const [invoicingForm, setInvoicingForm] = useState({
    taxID: "",
    vatNumber: "",
  });

  useEffect(() => {
    if (businessDetails) {
      setFormData({
        businessName: businessDetails.businessName || "",
        businessPhone: businessDetails.businessPhone || "",
        businessEmail: businessDetails.businessEmail || "",
        contactPerson: businessDetails.contactPerson || "",
        managerName: businessDetails.managerName || "",
        companyName: businessDetails.companyName || "",
        address: businessDetails.address || {
          street1: "",
          street2: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
        },
      });

      setAddressForm({
        companyName: businessDetails.companyName || "",
        companyPhone: businessDetails.businessPhone || "",
        companyScope: "",
        taxOffice: "",
        vatNumber: "",
        address:
          `${businessDetails.address?.street1 || ""} ${businessDetails.address?.street2 || ""}`.trim(),
        city: businessDetails.address?.city || "",
        postalCode: businessDetails.address?.postal_code || "",
        country: businessDetails.address?.country || "",
        invoicingEmail: businessDetails.businessEmail || "",
      });

      if (businessDetails.logo) {
        if (businessDetails.logo.startsWith("http")) {
          setPreviewUrl(businessDetails.logo);
        } else {
          setPreviewUrl(
            `${process.env.NEXT_PUBLIC_BASEURL}${businessDetails.logo}`,
          );
        }
      }
    }
  }, [businessDetails]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        toast.error("Please upload a PNG or JPEG image");
        return;
      }
      setLogoFile(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewUrl(previewURL);
    }
  };

  // FIXED FUNCTION: Sending data as individual form fields instead of nested JSON
  const handleSaveBusiness = async () => {
    try {
      const formDataToSend = new FormData();

      // Append logo file if exists
      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      // Create the business data object
      const businessData = {
        businessName: formData.businessName,
        businessPhone: formData.businessPhone,
        businessEmail: formData.businessEmail,
        contactPerson: formData.contactPerson,
        managerName: formData.managerName,
        companyName: formData.companyName,
        address: formData.address,
      };

      // Append the data as JSON string (like Postman)
      formDataToSend.append("data", JSON.stringify(businessData));

      console.log("Sending FormData:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await updateBusinessDetails(formDataToSend).unwrap();
      console.log("API Response:", result);

      toast.success("Business details saved successfully");

      // Refetch user data to get updated information
      await refetchUser();

      // Close Business Details and open Address Details
      setCollapsedSections({
        businessDetails: true,
        addressDetails: false,
        invoicingDetails: true,
        inviteMembers: true,
        packagingKit: true,
        prohibitedItems: true,
      });
    } catch (error: any) {
      console.error("Error saving business details:", error);
      console.error("Error response:", error?.data);
      toast.error(error?.data?.message || "Failed to save business details");
    }
  };

  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setLogoFile(null);
  };

  // FIXED FUNCTION: Sending data as individual form fields
  const handleSaveAddress = async () => {
    try {
      // Split address into street1 and street2
      const addressParts = addressForm.address.split(",");
      const street1 = addressParts[0]?.trim() || "";
      const street2 = addressParts.slice(1).join(",").trim() || "";

      const formDataToSend = new FormData();

      // Create the business data object with updated address
      const businessData = {
        businessName: formData.businessName,
        businessPhone: addressForm.companyPhone,
        businessEmail: addressForm.invoicingEmail,
        contactPerson: formData.contactPerson,
        managerName: formData.managerName,
        companyName: addressForm.companyName,
        address: {
          street1: street1,
          street2: street2,
          city: addressForm.city,
          state: addressForm.city, // Assuming state same as city
          postal_code: addressForm.postalCode,
          country: addressForm.country,
        },
      };

      // Append the data as JSON string (like Postman)
      formDataToSend.append("data", JSON.stringify(businessData));

      console.log("Sending FormData for address:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await updateBusinessDetails(formDataToSend).unwrap();
      console.log("API Response:", result);

      toast.success("Address details saved successfully");

      // Refetch user data to get updated information
      await refetchUser();

      // Close Address Details after saving
      setCollapsedSections((prev) => ({
        ...prev,
        addressDetails: true,
      }));
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error saving address details:", error);
      console.error("Error response:", error?.data);
      toast.error(error?.data?.message || "Failed to save address details");
    }
  };

  return (
    <div className="space-y-4">
      {/* Business Details */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-0">
        <CardContent className="p-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("businessDetails")}
          >
            <h3 className="text-lg font-semibold text-[#3A3A3A]">
              Business details
            </h3>
            <div className="w-11 h-11 bg-[#E6EAEF] hover:bg-[#E6EAEF]/80 rounded-full flex items-center justify-center p-0">
              {collapsedSections.businessDetails ? (
                <ChevronDown className="h-5 w-5 text-[#3A3A3A]" />
              ) : (
                <ChevronUp className="h-5 w-5 text-[#3A3A3A]" />
              )}
            </div>
          </div>
          {!collapsedSections.businessDetails && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex gap-6 items-start">
                  <div className="w-32 h-32 bg-[#E6EAEF] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Business Logo Preview"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        unoptimized={true}
                      />
                    ) : (
                      <Image
                        src="/dashboard/business/upload.svg"
                        alt="Upload placeholder"
                        width={48}
                        height={48}
                        className="opacity-50"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-sm text-[#3A3A3A]">
                      You can upload your own logo to help users identify your
                      business.
                    </p>
                    <div className="text-xs text-[#7C8493] space-y-1">
                      <p>• Max logo dimensions 200x200px</p>
                      <p>• Logo must be in png or jpeg format</p>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="logo-upload"
                        accept=".png,.jpg,.jpeg"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="bg-[#0096FF] text-white py-3 px-12 rounded text-center hover:bg-blue-600 transition-colors w-fit">
                          Upload logo
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessName: e.target.value,
                        })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone Number</Label>
                    <Input
                      id="businessPhone"
                      value={formData.businessPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessPhone: e.target.value,
                        })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">
                      Business Email Address
                    </Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={formData.businessEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          businessEmail: e.target.value,
                        })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">
                      Contact Person (Full Name)
                    </Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="managerName">Manager Name</Label>
                    <Input
                      id="managerName"
                      value={formData.managerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          managerName: e.target.value,
                        })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <Button
                      onClick={handleSaveBusiness}
                      disabled={isLoading}
                      className="bg-[#0096FF] text-white py-2 px-10 rounded hover:bg-blue-600 transition-colors"
                    >
                      {isLoading ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Details */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-0">
        <CardContent className="p-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection("addressDetails")}
          >
            <h3 className="text-lg font-semibold text-[#3A3A3A]">
              Address details
            </h3>
            <div className="w-11 h-11 bg-[#E6EAEF] hover:bg-[#E6EAEF]/80 rounded-full flex items-center justify-center p-0">
              {collapsedSections.addressDetails ? (
                <ChevronDown className="h-5 w-5 text-[#3A3A3A]" />
              ) : (
                <ChevronUp className="h-5 w-5 text-[#3A3A3A]" />
              )}
            </div>
          </div>
          {!collapsedSections.addressDetails && (
            <div className="space-y-4 mt-4">
              <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                You can view but not change your business's address details. If
                you want something changed, contact our support and we will make
                the change for you.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    value={addressForm.companyName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        companyName: e.target.value,
                      })
                    }
                    className="bg-[#E6EAEF] p-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Company phone</Label>
                  <Input
                    id="companyPhone"
                    value={addressForm.companyPhone}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        companyPhone: e.target.value,
                      })
                    }
                    className="bg-[#E6EAEF] p-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={addressForm.address}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        address: e.target.value,
                      })
                    }
                    className="bg-[#E6EAEF] p-6"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP / Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={addressForm.postalCode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          postalCode: e.target.value,
                        })
                      }
                      className="bg-[#E6EAEF] p-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="bg-[#E6EAEF] p-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoicingEmail">Invoicing email</Label>
                  <Input
                    id="invoicingEmail"
                    type="email"
                    value={addressForm.invoicingEmail}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        invoicingEmail: e.target.value,
                      })
                    }
                    className="bg-[#E6EAEF] p-6"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end items-center">
                <Button
                  onClick={handleSaveAddress}
                  disabled={isLoading}
                  className="bg-[#0096FF] text-white py-2 px-10 rounded hover:bg-blue-600 transition-colors"
                >
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSettingsContent;
