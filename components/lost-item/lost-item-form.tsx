// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { COUNTRIES } from "@/lib/countries";
// import { useSearchLocationsQuery } from "@/redux/features/locations/locationApi";
// import {
//   useAddShippingMutation,
//   useGetLostItemQuery,
// } from "@/redux/features/shipping/shippingApi";
// import { ChevronDown, ChevronRight, Loader, Plus, Trash2 } from "lucide-react";
// import { StaticImport } from "next/dist/shared/lib/get-img-props";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import ItemCategoryModal from "./item-category-modal";
// // Import location icon statically
// import locationIcon from "@/assets/favicon.ico";

// declare global {
//   interface Window {
//     google?: any;
//   }
// }

// interface SelectedItem {
//   name: string;
//   category: string;
//   subcategory: string;
//   description?: string;
//   icon: StaticImport;
// }

// interface LostItemFormData {
//   // name: string;
//   businessName: string;
//   email: string;
//   phone: string;
//   location: string;
//   placeName: string;
//   street1: string;
//   street2: string;
//   city: string;
//   state: string;
//   country: string;
//   countryCode: string;
//   countryName: string;
//   postalCode: string;
//   selectedItems: SelectedItem[];
//   sendAddress: string;
//   sendCountry: string;
//   sendStreet: string;
//   sendState: string;
//   address2: string;
//   sendCity: string;
//   sendCountryCode: string;
//   sendPostalCode: string;
//   sendBusinessName: string;
//   notes: string;
//   sendFullName: string;
//   sendCompanyName: string;
//   sendMobilePhone: string;
//   sendEmail: string;
//   shareOrderDetails: boolean;
// }

// export default function LostItemForm() {
//   const router = useRouter();
//   const params = useParams();
//   const itemTypesId = (params.id as string)?.toLowerCase();

//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
//   const [isCustomLocation, setIsCustomLocation] = useState(false);

//   const [isBusinessContactExpanded, setIsBusinessContactExpanded] = useState(false);
//   const {
//     register,
//     watch,
//     handleSubmit,
//     setValue,
//     setError,
//     clearErrors,
//     formState: { errors },
//   } = useForm<LostItemFormData>({
//     defaultValues: {
//       selectedItems: [],
//       shareOrderDetails: false,
//       location: "",
//       street1: "",
//       sendPostalCode: "",
//       postalCode: "",
//     },
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const shareOrderDetails = watch("shareOrderDetails");
//   const selectedItems = watch("selectedItems");
//   const address = watch("sendAddress");
//   const location = watch("location");
//   const street1 = watch("street1");
//   // const state = watch("state");

//   const { data: locationData, isLoading: isLocationLoading } =
//     useSearchLocationsQuery(
//       { type: itemTypesId, search: location },
//       { skip: !location }
//     );
//   const { data: addressData } = useSearchLocationsQuery(
//     { search: address },
//     { skip: !address }
//   );

//   const [addShipping, { isLoading }] = useAddShippingMutation();
//   const { data: lostItemData, isLoading: isLostItemLoading } =
//   useGetLostItemQuery(itemTypesId);

// // console.log("Lost Item", lostItemData);

//   const lostItemId = lostItemData?.data?._id;
//   // console.log(lostItemId);

//   // Set business address when data is loaded
//   useEffect(() => {
//     if (isLostItemLoading || !lostItemData?.data) return;

//     const mainData = lostItemData.data;
//     const userData = lostItemData.data.user;
//     const businessData = userData?.businessDetails;

//   console.log("Lost Item", mainData);

//     // Set business contact fields
//     if (businessData?.businessEmail) setValue("email", businessData.businessEmail);
//     else if (userData?.email) setValue("email", userData.email);

//     if (businessData?.telephone) {
//       setValue("phone", businessData.telephone);
//     }
//     if (businessData?.businessName)
//       setValue("businessName", businessData.businessName);

//     // Set item fields (Orders section)
//     if (mainData && selectedItems.length === 0) {
//       const newItem = {
//         name: mainData.itemName || "Lost Item",
//         category: mainData.itemCategory || "Other",
//         subcategory: mainData.itemSubcategory || "Other",
//         description: mainData.itemDescription || "",
//         icon: locationIcon, // default icon
//       };
//       setValue("selectedItems", [newItem]);
//     }

//     if (businessData) {
//       const formattedAddress = [
//         businessData.addressLine1,
//         businessData.city,
//         businessData.state,
//         businessData.country,
//         businessData.postcode,
//       ]
//         .filter(Boolean)
//         .join(", ");

//       setValue("location", formattedAddress);
//       setValue("street1", businessData.addressLine1 || "");
//       setValue("city", businessData.city || "");
//       setValue("country", businessData.country || "");
//       setValue("state", businessData.state || "");
//       setValue("postalCode", businessData.postcode || "");
//       setValue("countryCode", businessData.countryCode || "");
//       setValue("placeName", mainData.locationFound || "");

//       // Reset custom location state when pre-filled
//       setIsCustomLocation(false);
//     }

//     // // Set Guest details (Step 3)
//     // if (mainData.guestName) setValue("sendFullName", mainData.guestName);
//     // if (mainData.guestEmail) setValue("sendEmail", mainData.guestEmail);
//     // if (mainData.guestPhone) setValue("sendMobilePhone", mainData.guestPhone);

//   }, [lostItemData, isLostItemLoading, setValue, selectedItems.length]);

//   const handleAddItem = (item: SelectedItem) => {
//     const currentItems = selectedItems || [];
//     setValue("selectedItems", [...currentItems, item]);
//     clearErrors("selectedItems");
//     console.log("handleAddItem", selectedItems);
//   };

//   const handleDeleteItem = (index: number) => {
//     const currentItems = selectedItems || [];
//     setValue(
//       "selectedItems",
//       currentItems.filter((_, i) => i !== index)
//     );
//   };

//   const handleAddCustomLocation = () => {
//     // Set the location name to what the user typed
//     setValue("placeName", location);
//     setValue("location", location);

//     // Clear auto-filled fields since this is custom
//     setValue("street1", "");
//     setValue("street2", "");
//     setValue("city", "");
//     setValue("state", "");
//     setValue("country", "");
//     setValue("postalCode", "");
//     setValue("countryCode", "");

//     // Mark as custom location
//     setIsCustomLocation(true);
//     setShowSuggestions(false);
//   };

//   const handleSuggestionSelect = (loc: any) => {
//     setValue("location", loc.name);
//     setValue("street1", loc.street1);
//     setValue("city", loc.city);
//     setValue("country", loc.country);
//     setValue("state", loc.state);
//     setValue("postalCode", loc.postal_code);
//     setValue("countryCode", loc.countryCode);
//     setValue("placeName", loc.name);

//     // Reset custom location state
//     setIsCustomLocation(false);
//     setShowSuggestions(false);
//   };

//   const onSubmit = async (data: LostItemFormData) => {
//     if (!data.selectedItems || data.selectedItems.length === 0) {
//       setError("selectedItems", {
//         type: "required",
//         message: "Please add at least one item",
//       });
//       toast.error("Please add at least one item before continuing");
//       return;
//     }

//     try {
//       const res = await addShipping({
//         address_from: {
//           placeName: data.placeName,
//           businessName: data?.businessName,
//           // name: data.name,
//           street1: data.street1,
//           street2: data.street2,
//           city: data.city,
//           state: data.state,
//           postal_code: data.postalCode,
//           country: data.countryCode,
//           countryName: data.country,
//           phone: data.phone,
//           email: data.email,
//         },
//         address_to: {
//           name: data.sendFullName,
//           street1: data.sendStreet,
//           street2: data.address2,
//           city: data.sendCity,
//           state: data.sendState,
//           postal_code: data.sendPostalCode,
//           country: data.sendCountryCode,
//           countryName: data.sendCountry,
//           phone: data.sendMobilePhone,
//           email: data.sendEmail,
//         },
//         parcel: data.selectedItems.map((item) => ({
//           itemType: item.subcategory,
//           name: item.name,
//           description: item.description || "",
//         })),
//         lostItemId: lostItemId,
//         notes: data.notes,
//       });

//       if (res?.data?.success) {
//         toast.success(
//           res?.data?.message || "Shipping details saved successfully"
//         );
//         router.push(`/orders/${itemTypesId}/${res?.data?.data?._id}`);
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again.");
//       console.error("Shipping submission error:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {/* Step 1: Location */}
//       <Card className="border-2 border-blue-200 bg-white">
//         <div className="flex gap-0">
//           <div className="w-20 hidden md:flex flex-col items-center pt-6">
//             <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//               1
//             </div>
//             <div className="w-1 h-[90%] bg-blue-400 mt-4" />
//           </div>
//           <div className="p-6 flex-1">
//             <div className="relative z-10 w-full">
//               <div className="flex items-center gap-3 mb-4">
//                 <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//                   1
//                 </p>
//                 <h2 className="text-lg font-bold text-gray-900">Location</h2>
//               </div>
//               {/* Conditional rendering: Input vs Selected Location Summary */}
//               {!street1 && !isCustomLocation ? (
//                 // Location Search Input
//                 <div className="space-y-2">
//                   <Input
//                     id="location-input"
//                     {...register("location")}
//                     type="text"
//                     placeholder="Search where you lost your item"
//                     className="placeholder-shown:text-lg text-xl"
//                     onFocus={() => setShowSuggestions(true)}
//                     onBlur={() =>
//                       setTimeout(() => setShowSuggestions(false), 200)
//                     }
//                   />
//                   {showSuggestions && location && (
//                     <ul className="absolute z-50 left-0 right-0 mt-1 max-w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                       {isLocationLoading ? (
//                         <li className="px-4 py-3 text-center text-gray-500">
//                           Loading locations...
//                         </li>
//                       ) : locationData?.data?.length > 0 ? (
//                         locationData.data.map((loc: any, index: number) => (
//                           <li
//                             key={index}
//                             onClick={() => handleSuggestionSelect(loc)}
//                             className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
//                           >
//                             <p className="font-semibold text-sm text-gray-900">
//                               {loc.name}
//                             </p>
//                             <p className="text-xs text-gray-600">
//                               {[
//                                 loc.street1,
//                                 loc.city,
//                                 loc.countryCode,
//                                 loc.state,
//                                 loc.postal_code,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           </li>
//                         ))
//                       ) : (
//                         <li
//                           onClick={handleAddCustomLocation}
//                           className="px-4 py-3 cursor-pointer bg-blue-50 hover:bg-blue-100 transition flex items-center gap-2"
//                         >
//                           <Plus size={16} className="text-blue-600" />
//                           <div>
//                             <p className="font-semibold text-sm text-gray-900">
//                               Add custom location
//                             </p>
//                             <p className="text-xs text-gray-600">
//                               "{location}" not found? Add it manually
//                             </p>
//                           </div>
//                         </li>
//                       )}
//                       {!isLocationLoading &&
//                         locationData?.data?.length === 0 && (
//                           <li className="px-4 py-2 text-center text-xs text-gray-500 border-t border-gray-200">
//                             No locations found for "{location}"
//                           </li>
//                         )}
//                     </ul>
//                   )}
//                   <p className="text-sm text-gray-600">
//                     Search for the place where you forgot your item
//                   </p>
//                 </div>
//               ) : (
//                 // Selected Location Summary (for both suggested and custom)
//                 <div className="space-y-6">
//                   <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                     <div className="flex items-start gap-4">
//                       <div className="p-2 bg-white border border-blue-200 rounded-md flex-shrink-0">
//                         <Image
//                           src={locationIcon}
//                           alt="Location marker"
//                           width={40}
//                           height={40}
//                           className="w-8 h-8 object-contain"
//                         />
//                       </div>
//                       <div>
//                         <p className="font-bold text-gray-900 text-lg">
//                           {watch("location")}
//                         </p>
//                         {isCustomLocation ? (
//                           <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
//                             <Plus size={16} />
//                             Custom location - please fill address details below
//                           </p>
//                         ) : (
//                           <div className="mt-1 space-y-1 text-gray-700">
//                             {watch("street1") && <p>{watch("street1")}</p>}
//                             <p>
//                               {[watch("city"), watch("state"), watch("country")]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                             {watch("postalCode") && (
//                               <p>{watch("postalCode")}</p>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         // Clear all location fields
//                         setValue("location", "");
//                         setValue("street1", "");
//                         setValue("street2", "");
//                         setValue("city", "");
//                         setValue("state", "");
//                         setValue("country", "");
//                         setValue("postalCode", "");
//                         setValue("countryCode", "");
//                         setValue("placeName", "");
//                         // Reset custom location state
//                         setIsCustomLocation(false);
//                         // Focus the input field after clearing
//                         setTimeout(() => {
//                           document.getElementById("location-input")?.focus();
//                         }, 0);
//                       }}
//                       className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 bg-white border border-blue-300 rounded hover:bg-blue-50 transition self-start md:self-auto"
//                       aria-label="Change location"
//                     >
//                       Change location
//                     </button>
//                   </div>

//                   {/* Selected Location Details */}
//                   <div className="space-y-6">
//                     {/* Detailed address fields - conditionally shown based on location type or missing data */}
//                     {(isCustomLocation) && (
//                       <div className="space-y-4 pt-4 border-t">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               Street Address
//                             </label>
//                             <Input
//                               {...register("street1", {
//                                 required: "Street address is required",
//                               })}
//                               placeholder="Street address"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                             {errors.street1 && (
//                               <p className="mt-1 text-sm text-red-600">
//                                 {errors.street1.message}
//                               </p>
//                             )}
//                           </div>
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               Street Address 2
//                             </label>
//                             <Input
//                               {...register("street2")}
//                               placeholder="Apartment, suite, etc. (optional)"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                           </div>
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               City
//                             </label>
//                             <Input
//                               {...register("city", {
//                                 required: "City is required",
//                               })}
//                               type="text"
//                               placeholder="City"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                             {errors.city && (
//                               <p className="mt-1 text-sm text-red-600">
//                                 {errors.city.message}
//                               </p>
//                             )}
//                           </div>
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               State
//                             </label>
//                             <Input
//                               // {...register("state", {
//                               //   required: "State is required",
//                               // })}
//                               type="text"
//                               placeholder="State"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                             {/* {errors.state && (
//                               <p className="mt-1 text-sm text-red-600">
//                                 {errors.state.message}
//                               </p>
//                             )} */}
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               Country
//                             </label>
//                             <Input
//                               {...register("country", {
//                                 required: "Country is required",
//                               })}
//                               type="text"
//                               placeholder="Country"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                             {errors.country && (
//                               <p className="mt-1 text-sm text-red-600">
//                                 {errors.country.message}
//                               </p>
//                             )}
//                           </div>
//                           <div className="hidden">
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               Country Code
//                             </label>
//                             <Input
//                               {...register("countryCode")}
//                               type="text"
//                               placeholder="countryCode"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                           </div>
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               Postal Code
//                             </label>
//                             <Input
//                               {...register("postalCode")}
//                               type="text"
//                               placeholder="Postal / ZIP code"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                           </div>
//                         </div>

//                         {isCustomLocation && (
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1">
//                               Country Code
//                             </label>
//                             <Input
//                               {...register("countryCode", {
//                                 required:
//                                   "Country code is required for custom location",
//                               })}
//                               type="text"
//                               placeholder="e.g. US, GB, AE"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                             {errors.countryCode && (
//                               <p className="mt-1 text-sm text-red-600">
//                                 {errors.countryCode.message}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                         <div className="flex items-center my-6">
//                           <div className="grow border-t border-gray-300"></div>
//                           <span className="shrink mx-4 text-gray-500">
//                             verify business contact details below
//                           </span>
//                           <div className="grow border-t border-gray-300"></div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Email & Phone - always shown for both location types */}
//                     <div className="space-y-4 pt-4 border-t">
//                       <button
//                         type="button"
//                         onClick={() => setIsBusinessContactExpanded(!isBusinessContactExpanded)}
//                         className="flex items-center justify-between w-full text-left"
//                       >
//                         <h3 className="font-semibold text-gray-900">
//                           Do you know business contact?
//                         </h3>
//                         {isBusinessContactExpanded ? (
//                           <ChevronDown size={20} className="text-gray-500" />
//                         ) : (
//                           <ChevronRight size={20} className="text-gray-500" />
//                         )}
//                       </button>

//                       {isBusinessContactExpanded && (
//                         <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
//                           <div>
//                             <label className="text-sm font-semibold text-gray-700 block mb-1.5">
//                               Business Name
//                             </label>
//                             <Input
//                               // {...register("businessName", {
//                               //   required: "Business Name is required",
//                               // })}
//                               type="text"
//                               placeholder="businessName"
//                               className="placeholder-shown:text-lg text-xl"
//                             />
//                             {errors.businessName && (
//                               <p className="mt-1 text-sm text-red-600">
//                                 {errors.businessName?.message}
//                               </p>
//                             )}
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Email */}
//                             <div>
//                               <label className="text-sm font-semibold text-gray-700 block mb-1">
//                                 Email
//                               </label>
//                               <Input
//                                 // {...register("email", {
//                                 //   required: "Email is required",
//                                 //   pattern: {
//                                 //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                 //     message: "Please enter a valid email address",
//                                 //   },
//                                 // })}
//                                 type="email"
//                                 placeholder="Email address"
//                                 className="placeholder-shown:text-lg text-xl"
//                               />
//                               {errors.email && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                   {errors.email.message}
//                                 </p>
//                               )}
//                             </div>
//                             {/* Phone */}
//                             <div>
//                               <label className="text-sm font-semibold text-gray-700 block mb-1">
//                                 Phone
//                               </label>
//                               <Input
//                                 // {...register("phone", {
//                                 //   required: "Phone number is required",
//                                 //   pattern: {
//                                 //     value: /^\+?[0-9\s()-]{7,20}$/,
//                                 //     message: "Please enter a valid phone number",
//                                 //   },
//                                 // })}
//                                 type="tel"
//                                 placeholder="Phone number"
//                                 className="placeholder-shown:text-lg text-xl"
//                               />
//                               {errors.phone && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                   {errors.phone.message}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Step 2: What is the item */}
//       <Card className="border-2 border-blue-200 bg-white overflow-hidden">
//         <div className="flex gap-0">
//           <div className="w-20 hidden md:flex flex-col items-center pt-6">
//             <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//               2
//             </div>
//             <div className="w-1 h-[90%] bg-blue-400 mt-4" />
//           </div>
//           <div className="flex-1 p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//                 2
//               </p>
//               <h2 className="text-lg font-bold text-gray-900">
//                 {" "}
//                 What is the item
//               </h2>
//             </div>
//             <p className="text-sm text-gray-600 mb-4">
//               Please make sure that the item is not included in the restricted
//               items list. All restricted items (or any item similar in content
//               or description) cannot be carried under any circumstances (unless
//               exceptions are specifically noted). Any person sending such an
//               item may have their order cancelled without notice or refund.
//             </p>

//             {selectedItems && selectedItems.length > 0 && (
//               <div className="mb-4 space-y-2 z-50">
//                 {selectedItems.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-start justify-between bg-blue-50 p-4 rounded-lg"
//                   >
//                     <div className="flex items-center gap-4">
//                       {/* UNCOMMENT AND FIX THIS SECTION */}
//                       <div className="w-20 h-20 shrink-0 rounded-md bg-white border border-gray-200 flex items-center justify-center p-2">
//                         <Image
//                           src={item.icon}
//                           alt={item.name}
//                           width={100}
//                           height={100}
//                           className="w-full h-full object-contain"
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <p className="text-sm text-gray-500">
//                           {item.category}, {item.subcategory}
//                         </p>

//                         <p className="text-2xl font-semibold text-gray-900 capitalize">
//                           {item.name}
//                         </p>
//                         <p className="text-gray-700 ">{item.description}</p>
//                       </div>
//                     </div>
//                     <Button
//                       type="button"
//                       onClick={() => handleDeleteItem(idx)}
//                       className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded transition flex items-center gap-1"
//                       aria-label="Delete item"
//                     >
//                       <Trash2 size={16} />
//                       Delete
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <button
//               type="button"
//               onClick={() => setIsModalOpen(true)}
//               className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
//             >
//               Add an Item
//             </button>
//           </div>
//         </div>
//       </Card>

//       {/* Step 3: Where to send */}
//       <Card className="border-2 border-blue-200 bg-white overflow-hidden">
//         <div className="flex gap-0">
//           <div className="w-20 hidden md:flex flex-col items-center pt-6">
//             <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//               3
//             </div>
//             <div className="w-1 h-[90%] bg-blue-400 mt-4" />
//           </div>
//           <div className="flex-1 p-6 space-y-4">
//             <div className="flex items-center gap-3 mb-4">
//               <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//                 3
//               </p>
//               <h2 className="text-lg font-bold text-gray-900">
//                 Where to send?
//               </h2>
//             </div>
//             <div className="relative">
//               <Input
//                 {...register("sendAddress")}
//                 placeholder="Enter address"
//                 className="placeholder-shown:text-lg text-xl"
//                 onFocus={() => setShowAddressSuggestions(true)}
//                 onBlur={() =>
//                   setTimeout(() => setShowAddressSuggestions(false), 200)
//                 }
//               />
//               {showAddressSuggestions &&
//                 address &&
//                 addressData?.data?.length > 0 && (
//                   <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {addressData.data.map((loc: any, index: number) => (
//                       <li
//                         key={index}
//                         onClick={() => {
//                           setValue(
//                             "sendAddress",
//                             [loc.name].filter(Boolean).join(", ")
//                           );
//                           setValue("sendCountry", loc.country || "");
//                           setValue("sendState", loc.state || "");
//                           setValue("sendStreet", loc.street1 || "");
//                           setValue("sendCity", loc.city || "");
//                           setValue("sendPostalCode", loc.postal_code || "");
//                           setValue("sendCountryCode", loc.countryCode || "");
//                           setShowAddressSuggestions(false);
//                         }}
//                         className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
//                       >
//                         <p className="font-semibold text-sm text-gray-900">
//                           {loc.name}
//                         </p>
//                         <p className="text-xs text-gray-600">
//                           {[
//                             loc.street1,
//                             loc.city,
//                             loc.state,
//                             loc.postal_code,
//                             loc.countryCode,
//                           ]
//                             .filter(Boolean)
//                             .join(", ")}
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//             </div>

//             <div className="flex items-center my-6">
//               <div className="grow border-t border-gray-300"></div>
//               <span className="shrink mx-4 text-gray-500">
//                 Auto fille Or fill in the details below
//               </span>
//               <div className="grow border-t border-gray-300"></div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   State
//                 </label>
//                 <Input
//                   // {...register("sendState", {
//                   //   required: "State is required",
//                   // })}
//                   type="text"
//                   placeholder="State"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//                 {/* {errors.sendState && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.sendState?.message}
//                   </p>
//                 )} */}
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   Country
//                 </label>
//                 <select
//                   {...register("sendCountry")}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-xl"
//                 >
//                   <option value="">Select country</option>
//                   {COUNTRIES.map((country) => (
//                     <option key={country} value={country}>
//                       {country}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   Address Street & Number
//                 </label>
//                 <Input
//                   {...register("sendStreet")}
//                   placeholder="Street name & house number"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   Address 2
//                 </label>
//                 <Input
//                   {...register("address2")}
//                   placeholder="Apartment, suite, unit (optional)"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   City
//                 </label>
//                 <Input
//                   {...register("sendCity")}
//                   placeholder="City"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//               </div>
//               <div className="hidden">
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   Country Code
//                 </label>
//                 <Input
//                   {...register("sendCountryCode")}
//                   placeholder="Send Country Code"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   Postal code
//                 </label>
//                 <Input
//                   {...register("sendPostalCode")}
//                   placeholder="Postal / ZIP code"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700 block mb-1">
//                 Notes
//               </label>
//               <textarea
//                 {...register("notes")}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-shown:text-lg text-xl"
//                 placeholder="Additional notes (optional)"
//                 rows={3}
//               />
//             </div>

//             <div className="flex items-center my-6">
//               <div className="grow border-t border-gray-300"></div>
//               <span className="shrink mx-4 text-gray-500">
//                 fill in the details below
//               </span>
//               <div className="grow border-t border-gray-300"></div>
//             </div>

//             <div className="space-y-4 mt-8">
//               <h3 className="font-semibold text-gray-900">
//                 Your Contact Details:
//               </h3>
//               {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 block mb-1">
//                     Full name
//                   </label>
//                   <Input
//                     {...register("sendFullName", {
//                       required: "Full name is required",
//                     })}
//                     placeholder="Your full name"
//                     className="placeholder-shown:text-lg text-xl"
//                   />
//                   {errors.sendFullName && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.sendFullName.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 block mb-1">
//                     Company name (if applicable)
//                   </label>
//                   <Input
//                     {...register("sendCompanyName")}
//                     placeholder="Company name (optional)"
//                     className="placeholder-shown:text-lg text-xl"
//                   />
//                 </div>
//               </div> */}
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   Full name
//                 </label>
//                 <Input
//                   {...register("sendFullName", {
//                     required: "Full name is required",
//                   })}
//                   placeholder="Enter your name"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//                 {errors.sendFullName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.sendFullName?.message}
//                   </p>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 block mb-1">
//                     Mobile Phone
//                   </label>
//                   <Input
//                     {...register("sendMobilePhone", {
//                       required: "Mobile Phone is required",
//                     })}
//                     type="tel"
//                     placeholder="Mobile phone number"
//                     className="placeholder-shown:text-lg text-xl"
//                   />
//                   {errors.sendMobilePhone && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.sendMobilePhone?.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="text-sm font-semibold text-gray-700 block mb-1">
//                     Email
//                   </label>
//                   <Input
//                     {...register("sendEmail", {
//                       required: "Email is required",
//                       pattern: {
//                         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                         message: "Please enter a valid email address",
//                       },
//                     })}
//                     type="email"
//                     placeholder="Email address"
//                     className="placeholder-shown:text-lg text-xl"
//                   />
//                   {errors.sendEmail && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.sendEmail?.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               {/* <div>
//                 <label className="text-sm font-semibold text-gray-700 block mb-1">
//                   Business name (if applicable)
//                 </label>
//                 <Input
//                   {...register("sendBusinessName")}
//                   placeholder="Business Name (optional)"
//                   className="placeholder-shown:text-lg text-xl"
//                 />
//               </div>{" "} */}
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Step 4: Terms & Conditions */}
//       <Card className="border-2 border-blue-200 bg-white overflow-hidden">
//         <div className="flex gap-0">
//           <div className="w-20 hidden md:flex flex-col items-center pt-6">
//             <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//               4
//             </div>
//             <div className="w-1 h-[90%] bg-blue-400 mt-4" />
//           </div>
//           <div className="flex-1 p-6 space-y-4">
//             <div className="flex items-center gap-3 mb-4">
//               <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
//                 4
//               </p>
//               <h2 className="text-lg font-bold text-gray-900">
//                 Terms & Conditions
//               </h2>
//             </div>
//             <ul className="list-disc ml-4">
//               <li>
//                 I agree to the&nbsp;
//                 <Link
//                   href={"/terms-conditions"}
//                   target="_blank"
//                   className="text-primary hover:underline"
//                 >
//                   Terms & Conditions
//                 </Link>
//                 &nbsp;and&nbsp;
//                 <Link
//                   href={"/refund-policy"}
//                   target="_blank"
//                   className="text-primary hover:underline"
//                 >
//                   Refund Policy
//                 </Link>
//                 &nbsp;and confirm that my shipment complies with the&nbsp;
//                 {/* <Link
//                   href={"/restricted-items"}
//                   target="_blank"
//                   className="text-primary hover:underline"
//                 > */}
//                 restricted items
//                 {/* </Link> */}
//                 &nbsp;list
//               </li>
//               <li>
//                 I agree that the description of the items included in my package
//                 that I have declared is accurate
//               </li>
//               <li>
//                 I understand that if a package is found with a forbidden item
//                 the courier will return the package and the cost of my shipment
//                 will not be refunded
//               </li>
//             </ul>

//             <div className="space-y-3">
//               <label className="flex items-start gap-3 cursor-pointer pb-3">
//                 <input
//                   type="checkbox"
//                   {...register("shareOrderDetails")}
//                   className="w-4 h-4 mt-1 border-gray-300 rounded"
//                 />
//                 <span className="text-sm text-gray-700">
//                   I consent to share order details with the hotel and the
//                   courier to fulfill this delivery.
//                 </span>
//               </label>
//             </div>

//             <Button
//               type="submit"
//               disabled={!shareOrderDetails || isLoading}
//               className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
//                 shareOrderDetails && !isLoading
//                   ? "bg-primary hover:bg-blue-600 cursor-pointer"
//                   : "bg-gray-400 cursor-not-allowed opacity-50"
//               }`}
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <Loader className="animate-spin size-5 mr-2" />
//                   Processing...
//                 </div>
//               ) : (
//                 "Get Shipping Rates"
//               )}
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Item Category Modal */}
//       <ItemCategoryModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSelectItem={handleAddItem}
//       />
//     </form>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/lib/countries";
import { useSearchLocationsQuery } from "@/redux/features/locations/locationApi";
import {
  useAddShippingMutation,
  useGetLostItemQuery,
} from "@/redux/features/shipping/shippingApi";
import { ChevronDown, ChevronRight, Loader, Plus, Trash2 } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ItemCategoryModal from "./item-category-modal";
// Import location icon statically
import locationIcon from "@/assets/favicon.ico";

declare global {
  interface Window {
    google?: any;
  }
}

interface SelectedItem {
  name: string;
  category: string;
  subcategory: string;
  description?: string;
  icon: StaticImport;
}

interface LostItemFormData {
  // name: string;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  placeName: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  countryName: string;
  postalCode: string;
  selectedItems: SelectedItem[];
  sendAddress: string;
  sendCountry: string;
  sendStreet: string;
  sendState: string;
  address2: string;
  sendCity: string;
  sendCountryCode: string;
  sendPostalCode: string;
  sendBusinessName: string;
  notes: string;
  sendFullName: string;
  sendCompanyName: string;
  sendMobilePhone: string;
  sendEmail: string;
  shareOrderDetails: boolean;
}

export default function LostItemForm() {
  const router = useRouter();
  const params = useParams();
  const itemTypesId = (params.id as string)?.toLowerCase();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  const [isBusinessContactExpanded, setIsBusinessContactExpanded] =
    useState(false);
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LostItemFormData>({
    defaultValues: {
      selectedItems: [],
      shareOrderDetails: false,
      location: "",
      street1: "",
      sendPostalCode: "",
      postalCode: "",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const shareOrderDetails = watch("shareOrderDetails");
  const selectedItems = watch("selectedItems");
  const address = watch("sendAddress");
  const location = watch("location");
  const street1 = watch("street1");
  // const state = watch("state");

  const { data: locationData, isLoading: isLocationLoading } =
    useSearchLocationsQuery(
      { type: itemTypesId, search: location },
      { skip: !location },
    );
  const { data: addressData } = useSearchLocationsQuery(
    { search: address },
    { skip: !address },
  );

  const [addShipping, { isLoading }] = useAddShippingMutation();
  const { data: lostItemData, isLoading: isLostItemLoading } =
    useGetLostItemQuery(itemTypesId);

  // console.log("Lost Item", lostItemData);

  const lostItemId = lostItemData?.data?._id;
  // console.log(lostItemId);

  // Set business address when data is loaded
  useEffect(() => {
    if (isLostItemLoading || !lostItemData?.data) return;

    const mainData = lostItemData.data;
    const userData = lostItemData.data.user;
    const businessData = userData?.businessDetails;

    console.log("Lost Item", mainData);

    if (userData?.email) setValue("email", userData.email); // change here

    if (businessData?.telephone) {
      setValue("phone", businessData.telephone);
    }
    if (businessData?.businessName)
      setValue("businessName", businessData.businessName);

    // Set item fields (Orders section)
    if (mainData && selectedItems.length === 0) {
      const newItem = {
        name: mainData.itemName || "Lost Item",
        category: mainData.itemCategory || "Other",
        subcategory: mainData.itemSubcategory || "Other",
        description: mainData.itemDescription || "",
        icon: locationIcon, // default icon
      };
      setValue("selectedItems", [newItem]);
    }

    if (businessData) {
      const formattedAddress = [
        businessData.addressLine1,
        businessData.city,
        businessData.state,
        businessData.country,
        businessData.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      setValue("location", formattedAddress);
      setValue("street1", businessData.addressLine1 || "");
      setValue("city", businessData.city || "");
      setValue("country", businessData.country || "");
      setValue("state", businessData.state || "");
      setValue("postalCode", businessData.postcode || "");
      setValue("countryCode", businessData.countryCode || "");
      setValue("placeName", mainData.locationFound || "");

      setIsCustomLocation(false);
    }
  }, [lostItemData, isLostItemLoading, setValue, selectedItems.length]);

  const handleAddItem = (item: SelectedItem) => {
    const currentItems = selectedItems || [];
    setValue("selectedItems", [...currentItems, item]);
    clearErrors("selectedItems");
    console.log("handleAddItem", selectedItems);
  };

  const handleDeleteItem = (index: number) => {
    const currentItems = selectedItems || [];
    setValue(
      "selectedItems",
      currentItems.filter((_, i) => i !== index),
    );
  };

  const handleAddCustomLocation = () => {
    // Set the location name to what the user typed
    setValue("placeName", location);
    setValue("location", location);

    // Clear auto-filled fields since this is custom
    setValue("street1", "");
    setValue("street2", "");
    setValue("city", "");
    setValue("state", "");
    setValue("country", "");
    setValue("postalCode", "");
    setValue("countryCode", "");

    // Mark as custom location
    setIsCustomLocation(true);
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (loc: any) => {
    setValue("location", loc.name);
    setValue("street1", loc.street1);
    setValue("city", loc.city);
    setValue("country", loc.country);
    setValue("state", loc.state);
    setValue("postalCode", loc.postal_code);
    setValue("countryCode", loc.countryCode);
    setValue("placeName", loc.name);

    // Reset custom location state
    setIsCustomLocation(false);
    setShowSuggestions(false);
  };

  const onSubmit = async (data: LostItemFormData) => {
    console.log("Get Shipping Rates", data);
    if (!data.selectedItems || data.selectedItems.length === 0) {
      setError("selectedItems", {
        type: "required",
        message: "Please add at least one item",
      });
      toast.error("Please add at least one item before continuing");
      return;
    }

    try {
      const res = await addShipping({
        address_from: {
          placeName: data.placeName,
          businessName: data?.businessName,
          // name: data.name,
          street1: data.street1,
          street2: data.street2,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          country: data.countryCode,
          countryName: data.country,
          phone: data.phone,
          email: data.email,
        },
        address_to: {
          name: data.sendFullName,
          street1: data.sendStreet,
          street2: data.address2,
          city: data.sendCity,
          state: data.sendState,
          postal_code: data.sendPostalCode,
          country: data.sendCountryCode,
          countryName: data.sendCountry,
          phone: data.sendMobilePhone,
          email: data.sendEmail,
        },
        parcel: data.selectedItems.map((item) => ({
          itemType: item.subcategory,
          name: item.name,
          description: item.description || "",
        })),
        lostItemId: lostItemId,
        notes: data.notes,
      });

      if (res?.data?.success) {
        toast.success(
          res?.data?.message || "Shipping details saved successfully",
        );
        router.push(`/orders/${itemTypesId}/${res?.data?.data?._id}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Shipping submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step 1: Location */}
      <Card className="border-2 border-blue-200 bg-white">
        <div className="flex gap-0">
          <div className="w-20 hidden md:flex flex-col items-center pt-6">
            <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="w-1 h-[90%] bg-blue-400 mt-4" />
          </div>
          <div className="p-6 flex-1">
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-4">
                <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
                  1
                </p>
                <h2 className="text-lg font-bold text-gray-900">Location</h2>
              </div>
              {/* Conditional rendering: Input vs Selected Location Summary */}
              {!street1 && !isCustomLocation ? (
                // Location Search Input
                <div className="space-y-2">
                  <Input
                    id="location-input"
                    {...register("location")}
                    type="text"
                    placeholder="Search where you lost your item"
                    className="placeholder-shown:text-lg text-xl"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                  />
                  {showSuggestions && location && (
                    <ul className="absolute z-50 left-0 right-0 mt-1 max-w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isLocationLoading ? (
                        <li className="px-4 py-3 text-center text-gray-500">
                          Loading locations...
                        </li>
                      ) : locationData?.data?.length > 0 ? (
                        locationData.data.map((loc: any, index: number) => (
                          <li
                            key={index}
                            onClick={() => handleSuggestionSelect(loc)}
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
                          >
                            <p className="font-semibold text-sm text-gray-900">
                              {loc.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {[
                                loc.street1,
                                loc.city,
                                loc.countryCode,
                                loc.state,
                                loc.postal_code,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </li>
                        ))
                      ) : (
                        <li
                          onClick={handleAddCustomLocation}
                          className="px-4 py-3 cursor-pointer bg-blue-50 hover:bg-blue-100 transition flex items-center gap-2"
                        >
                          <Plus size={16} className="text-blue-600" />
                          <div>
                            <p className="font-semibold text-sm text-gray-900">
                              Add custom location
                            </p>
                            <p className="text-xs text-gray-600">
                              "{location}" not found? Add it manually
                            </p>
                          </div>
                        </li>
                      )}
                      {!isLocationLoading &&
                        locationData?.data?.length === 0 && (
                          <li className="px-4 py-2 text-center text-xs text-gray-500 border-t border-gray-200">
                            No locations found for "{location}"
                          </li>
                        )}
                    </ul>
                  )}
                  <p className="text-sm text-gray-600">
                    Search for the place where you forgot your item
                  </p>
                </div>
              ) : (
                // Selected Location Summary (for both suggested and custom)
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white border border-blue-200 rounded-md flex-shrink-0">
                        <Image
                          src={locationIcon}
                          alt="Location marker"
                          width={40}
                          height={40}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {watch("location")}
                        </p>
                        {isCustomLocation ? (
                          <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                            <Plus size={16} />
                            Custom location - please fill address details below
                          </p>
                        ) : (
                          <div className="mt-1 space-y-1 text-gray-700">
                            {watch("street1") && <p>{watch("street1")}</p>}
                            <p>
                              {[watch("city"), watch("state"), watch("country")]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            {watch("postalCode") && (
                              <p>{watch("postalCode")}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Clear all location fields
                        setValue("location", "");
                        setValue("street1", "");
                        setValue("street2", "");
                        setValue("city", "");
                        setValue("state", "");
                        setValue("country", "");
                        setValue("postalCode", "");
                        setValue("countryCode", "");
                        setValue("placeName", "");
                        // Reset custom location state
                        setIsCustomLocation(false);
                        // Focus the input field after clearing
                        setTimeout(() => {
                          document.getElementById("location-input")?.focus();
                        }, 0);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 bg-white border border-blue-300 rounded hover:bg-blue-50 transition self-start md:self-auto"
                      aria-label="Change location"
                    >
                      Change location
                    </button>
                  </div>

                  {/* Selected Location Details */}
                  <div className="space-y-6">
                    {/* Detailed address fields - conditionally shown based on location type or missing data */}
                    {isCustomLocation && (
                      <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              Street Address
                            </label>
                            <Input
                              {...register("street1", {
                                required: "Street address is required",
                              })}
                              placeholder="Street address"
                              className="placeholder-shown:text-lg text-xl"
                            />
                            {errors.street1 && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.street1.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              Street Address 2
                            </label>
                            <Input
                              {...register("street2")}
                              placeholder="Apartment, suite, etc. (optional)"
                              className="placeholder-shown:text-lg text-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              City
                            </label>
                            <Input
                              {...register("city", {
                                required: "City is required",
                              })}
                              type="text"
                              placeholder="City"
                              className="placeholder-shown:text-lg text-xl"
                            />
                            {errors.city && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              State
                            </label>
                            <Input
                              // {...register("state", {
                              //   required: "State is required",
                              // })}
                              type="text"
                              placeholder="State"
                              className="placeholder-shown:text-lg text-xl"
                            />
                            {/* {errors.state && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.state.message}
                              </p>
                            )} */}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              Country
                            </label>
                            <Input
                              {...register("country", {
                                required: "Country is required",
                              })}
                              type="text"
                              placeholder="Country"
                              className="placeholder-shown:text-lg text-xl"
                            />
                            {errors.country && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.country.message}
                              </p>
                            )}
                          </div>
                          <div className="hidden">
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              Country Code
                            </label>
                            <Input
                              {...register("countryCode")}
                              type="text"
                              placeholder="countryCode"
                              className="placeholder-shown:text-lg text-xl"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              Postal Code
                            </label>
                            <Input
                              {...register("postalCode")}
                              type="text"
                              placeholder="Postal / ZIP code"
                              className="placeholder-shown:text-lg text-xl"
                            />
                          </div>
                        </div>

                        {isCustomLocation && (
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1">
                              Country Code
                            </label>
                            <Input
                              {...register("countryCode", {
                                required:
                                  "Country code is required for custom location",
                              })}
                              type="text"
                              placeholder="e.g. US, GB, AE"
                              className="placeholder-shown:text-lg text-xl"
                            />
                            {errors.countryCode && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.countryCode.message}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="flex items-center my-6">
                          <div className="grow border-t border-gray-300"></div>
                          <span className="shrink mx-4 text-gray-500">
                            verify business contact details below
                          </span>
                          <div className="grow border-t border-gray-300"></div>
                        </div>
                      </div>
                    )}

                    {/* Email & Phone - always shown for both location types */}
                    <div className="space-y-4 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() =>
                          setIsBusinessContactExpanded(
                            !isBusinessContactExpanded,
                          )
                        }
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="font-semibold text-gray-900">
                          Do you know business contact?
                        </h3>
                        {isBusinessContactExpanded ? (
                          <ChevronDown size={20} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={20} className="text-gray-500" />
                        )}
                      </button>

                      {isBusinessContactExpanded && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                              Business Name
                            </label>
                            <Input
                              // {...register("businessName", {
                              //   required: "Business Name is required",
                              // })}
                              type="text"
                              placeholder="businessName"
                              className="placeholder-shown:text-lg text-xl"
                            />
                            {errors.businessName && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.businessName?.message}
                              </p>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div>
                              <label className="text-sm font-semibold text-gray-700 block mb-1">
                                Email
                              </label>
                              <Input
                                type="email"
                                placeholder="Email address"
                                className="placeholder-shown:text-lg text-xl"
                              />
                              {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            {/* Phone */}
                            <div>
                              <label className="text-sm font-semibold text-gray-700 block mb-1">
                                Phone
                              </label>
                              <Input
                                // {...register("phone", {
                                //   required: "Phone number is required",
                                //   pattern: {
                                //     value: /^\+?[0-9\s()-]{7,20}$/,
                                //     message: "Please enter a valid phone number",
                                //   },
                                // })}
                                type="tel"
                                placeholder="Phone number"
                                className="placeholder-shown:text-lg text-xl"
                              />
                              {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.phone.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Step 2: What is the item */}
      <Card className="border-2 border-blue-200 bg-white overflow-hidden">
        <div className="flex gap-0">
          <div className="w-20 hidden md:flex flex-col items-center pt-6">
            <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="w-1 h-[90%] bg-blue-400 mt-4" />
          </div>
          <div className="flex-1 p-6">
            <div className="flex items-center gap-3 mb-4">
              <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
                2
              </p>
              <h2 className="text-lg font-bold text-gray-900">
                {" "}
                What is the item
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please make sure that the item is not included in the restricted
              items list. All restricted items (or any item similar in content
              or description) cannot be carried under any circumstances (unless
              exceptions are specifically noted). Any person sending such an
              item may have their order cancelled without notice or refund.
            </p>

            {selectedItems && selectedItems.length > 0 && (
              <div className="mb-4 space-y-2 z-50">
                {selectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between bg-blue-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {/* UNCOMMENT AND FIX THIS SECTION */}
                      <div className="w-20 h-20 shrink-0 rounded-md bg-white border border-gray-200 flex items-center justify-center p-2">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          {item.category}, {item.subcategory}
                        </p>

                        <p className="text-2xl font-semibold text-gray-900 capitalize">
                          {item.name}
                        </p>
                        <p className="text-gray-700 ">{item.description}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded transition flex items-center gap-1"
                      aria-label="Delete item"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Add an Item
            </button>
          </div>
        </div>
      </Card>

      {/* Step 3: Where to send */}
      <Card className="border-2 border-blue-200 bg-white overflow-hidden">
        <div className="flex gap-0">
          <div className="w-20 hidden md:flex flex-col items-center pt-6">
            <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="w-1 h-[90%] bg-blue-400 mt-4" />
          </div>
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
                3
              </p>
              <h2 className="text-lg font-bold text-gray-900">
                Where to send?
              </h2>
            </div>
            <div className="relative">
              <Input
                {...register("sendAddress")}
                placeholder="Enter address"
                className="placeholder-shown:text-lg text-xl"
                onFocus={() => setShowAddressSuggestions(true)}
                onBlur={() =>
                  setTimeout(() => setShowAddressSuggestions(false), 200)
                }
              />
              {showAddressSuggestions &&
                address &&
                addressData?.data?.length > 0 && (
                  <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {addressData.data.map((loc: any, index: number) => (
                      <li
                        key={index}
                        onClick={() => {
                          setValue(
                            "sendAddress",
                            [loc.name].filter(Boolean).join(", "),
                          );
                          setValue("sendCountry", loc.country || "");
                          setValue("sendState", loc.state || "");
                          setValue("sendStreet", loc.street1 || "");
                          setValue("sendCity", loc.city || "");
                          setValue("sendPostalCode", loc.postal_code || "");
                          setValue("sendCountryCode", loc.countryCode || "");
                          setShowAddressSuggestions(false);
                        }}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
                      >
                        <p className="font-semibold text-sm text-gray-900">
                          {loc.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {[
                            loc.street1,
                            loc.city,
                            loc.state,
                            loc.postal_code,
                            loc.countryCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            <div className="flex items-center my-6">
              <div className="grow border-t border-gray-300"></div>
              <span className="shrink mx-4 text-gray-500">
                Auto fille Or fill in the details below
              </span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  State
                </label>
                <Input
                  // {...register("sendState", {
                  //   required: "State is required",
                  // })}
                  type="text"
                  placeholder="State"
                  className="placeholder-shown:text-lg text-xl"
                />
                {/* {errors.sendState && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sendState?.message}
                  </p>
                )} */}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Country
                </label>
                <select
                  {...register("sendCountry")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xl"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Address Street & Number
                </label>
                <Input
                  {...register("sendStreet")}
                  placeholder="Street name & house number"
                  className="placeholder-shown:text-lg text-xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Address 2
                </label>
                <Input
                  {...register("address2")}
                  placeholder="Apartment, suite, unit (optional)"
                  className="placeholder-shown:text-lg text-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  City
                </label>
                <Input
                  {...register("sendCity")}
                  placeholder="City"
                  className="placeholder-shown:text-lg text-xl"
                />
              </div>
              <div className="hidden">
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Country Code
                </label>
                <Input
                  {...register("sendCountryCode")}
                  placeholder="Send Country Code"
                  className="placeholder-shown:text-lg text-xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Postal code
                </label>
                <Input
                  {...register("sendPostalCode")}
                  placeholder="Postal / ZIP code"
                  className="placeholder-shown:text-lg text-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Notes
              </label>
              <textarea
                {...register("notes")}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm placeholder-shown:text-lg text-xl"
                placeholder="Additional notes (optional)"
                rows={3}
              />
            </div>

            <div className="flex items-center my-6">
              <div className="grow border-t border-gray-300"></div>
              <span className="shrink mx-4 text-gray-500">
                fill in the details below
              </span>
              <div className="grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-4 mt-8">
              <h3 className="font-semibold text-gray-900">
                Your Contact Details:
              </h3>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Full name
                  </label>
                  <Input
                    {...register("sendFullName", {
                      required: "Full name is required",
                    })}
                    placeholder="Your full name"
                    className="placeholder-shown:text-lg text-xl"
                  />
                  {errors.sendFullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.sendFullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Company name (if applicable)
                  </label>
                  <Input
                    {...register("sendCompanyName")}
                    placeholder="Company name (optional)"
                    className="placeholder-shown:text-lg text-xl"
                  />
                </div>
              </div> */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Full name
                </label>
                <Input
                  {...register("sendFullName", {
                    required: "Full name is required",
                  })}
                  placeholder="Enter your name"
                  className="placeholder-shown:text-lg text-xl"
                />
                {errors.sendFullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sendFullName?.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Mobile Phone
                  </label>
                  <Input
                    {...register("sendMobilePhone", {
                      required: "Mobile Phone is required",
                    })}
                    type="tel"
                    placeholder="Mobile phone number"
                    className="placeholder-shown:text-lg text-xl"
                  />
                  {errors.sendMobilePhone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.sendMobilePhone?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Email
                  </label>
                  <Input
                    {...register("sendEmail", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    type="email"
                    placeholder="Email address"
                    className="placeholder-shown:text-lg text-xl"
                  />
                  {errors.sendEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.sendEmail?.message}
                    </p>
                  )}
                </div>
              </div>
              {/* <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Business name (if applicable)
                </label>
                <Input
                  {...register("sendBusinessName")}
                  placeholder="Business Name (optional)"
                  className="placeholder-shown:text-lg text-xl"
                />
              </div>{" "} */}
            </div>
          </div>
        </div>
      </Card>

      {/* Step 4: Terms & Conditions */}
      <Card className="border-2 border-blue-200 bg-white overflow-hidden">
        <div className="flex gap-0">
          <div className="w-20 hidden md:flex flex-col items-center pt-6">
            <div className="w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div className="w-1 h-[90%] bg-blue-400 mt-4" />
          </div>
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <p className="md:hidden w-10 h-10 rounded-full border-4 border-primary text-black flex items-center justify-center font-bold text-lg">
                4
              </p>
              <h2 className="text-lg font-bold text-gray-900">
                Terms & Conditions
              </h2>
            </div>
            <ul className="list-disc ml-4">
              <li>
                I agree to the&nbsp;
                <Link
                  href={"/terms-conditions"}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Terms & Conditions
                </Link>
                &nbsp;and&nbsp;
                <Link
                  href={"/refund-policy"}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Refund Policy
                </Link>
                &nbsp;and confirm that my shipment complies with the&nbsp;
                {/* <Link
                  href={"/restricted-items"}
                  target="_blank"
                  className="text-primary hover:underline"
                > */}
                restricted items
                {/* </Link> */}
                &nbsp;list
              </li>
              <li>
                I agree that the description of the items included in my package
                that I have declared is accurate
              </li>
              <li>
                I understand that if a package is found with a forbidden item
                the courier will return the package and the cost of my shipment
                will not be refunded
              </li>
            </ul>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  {...register("shareOrderDetails")}
                  className="w-4 h-4 mt-1 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I consent to share order details with the hotel and the
                  courier to fulfill this delivery.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={!shareOrderDetails || isLoading}
              className={`w-full py-2 px-4 rounded font-semibold text-white transition ${
                shareOrderDetails && !isLoading
                  ? "bg-primary hover:bg-blue-600 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin size-5 mr-2" />
                  Processing...
                </div>
              ) : (
                "Get Shipping Rates"
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Item Category Modal */}
      <ItemCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectItem={handleAddItem}
      />
    </form>
  );
}
