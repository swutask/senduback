// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { MapPin, ChevronRight, ChevronLeft, Upload, X } from "lucide-react";
// import Image from "next/image";
// import QRScannerModal from "@/components/dashboard/lost-items-list/QRScannerModal";
// import { z } from "zod";
// import { toast } from "sonner";
// import { useCreateLostItemMutation, useUploadLostItemImageMutation } from "@/redux/features/lostItem/lostitemApi";
// import { useRouter } from "next/navigation";
// import io, { Socket } from "socket.io-client";

// const formSchema = z.object({
//     itemName: z.string().min(1, "Item name is required"),
//     itemDescription: z.string().min(1, "Item description is required"),
//     dateFound: z
//         .string()
//         .min(1, "Date is required")
//         .refine((date) => {
//             return !isNaN(Date.parse(date));
//         }, "Invalid date format"),
//     locationFound: z.string().min(1, "Found location is required"),
//     guestName: z.string().optional(),
//     guestEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
//     guestPhone: z.string().optional(),
//     guestReservationName: z.string().optional(),
//     guestRoomNumber: z.string().optional(),
//     checkoutDate: z
//         .string()
//         .optional()
//         .refine((date) => {
//             if (!date) return true;
//             return !isNaN(Date.parse(date));
//         }, "Invalid date format"),
//     note: z.string().optional(),
// });

// type FormData = z.infer<typeof formSchema>;

// const AddLostItemPage = () => {
//     const router = useRouter();
//     const [currentStep, setCurrentStep] = useState(1);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const [createdItemId, setCreatedItemId] = useState<string | null>(null);
//     const [desktopImages, setDesktopImages] = useState<File[]>([]);
//     const [desktopImagePreviews, setDesktopImagePreviews] = useState<string[]>([]);
//     const [socketImages, setSocketImages] = useState<string[]>([]);
//     const socketRef = useRef<Socket | null>(null);
//     const baseURL = process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";

//     const [createLostItem] = useCreateLostItemMutation();
//     const [uploadLostItemImage] = useUploadLostItemImageMutation();

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         trigger,
//         watch,
//     } = useForm<FormData>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             itemName: "",
//             itemDescription: "",
//             dateFound: new Date().toISOString().split("T")[0],
//             locationFound: "",
//             guestName: "",
//             guestEmail: "",
//             guestPhone: "",
//             guestReservationName: "",
//             guestRoomNumber: "",
//             checkoutDate: "",
//             note: "",
//         },
//     });

//     const nextStep = async () => {
//         if (currentStep === 1) {
//             const isValid = await trigger(["itemName", "itemDescription", "dateFound", "locationFound"]);
//             if (isValid) {
//                 setCurrentStep(2);
//             } else {
//                 toast.error("Please fill in all required fields correctly");
//             }
//         }
//     };

//     const prevStep = () => {
//         setCurrentStep((prev) => Math.max(prev - 1, 1));
//     };

//     const onSubmit = async (data: FormData) => {
//         setIsSubmitting(true);

//         try {
//             const formattedData = {
//                 itemName: data.itemName,
//                 itemDescription: data.itemDescription,
//                 dateFound: new Date(data.dateFound).toISOString(),
//                 locationFound: data.locationFound,
//                 guestName: data.guestName || undefined,
//                 guestEmail: data.guestEmail || undefined,
//                 guestPhone: data.guestPhone || undefined,
//                 guestReservationName: data.guestReservationName || undefined,
//                 guestRoomNumber: data.guestRoomNumber || undefined,
//                 checkoutDate: data.checkoutDate ? new Date(data.checkoutDate).toISOString() : undefined,
//                 note: data.note || undefined,
//             };

//             const createResponse = await createLostItem(formattedData).unwrap();
//             const lostItemId = createResponse.data._id;
//             setCreatedItemId(lostItemId);

//             toast.success("Lost item created successfully!");
//             setCurrentStep(3);
//             initializeSocketConnection(lostItemId);
//         } catch (error: any) {
//             console.error("Error creating lost item:", error);
//             if (error?.data?.errorMessages) {
//                 error.data.errorMessages.forEach((err: any) => {
//                     toast.error(`${err.path}: ${err.message}`);
//                 });
//             } else {
//                 toast.error(error?.data?.message || "Failed to create lost item. Please try again.");
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleDesktopImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files) return;

//         const newImages = Array.from(files).slice(0, 3 - desktopImages.length);
//         setDesktopImages((prev) => [...prev, ...newImages]);

//         const newPreviews = newImages.map((file) => URL.createObjectURL(file));
//         setDesktopImagePreviews((prev) => [...prev, ...newPreviews]);
//     };

//     const removeDesktopImage = (index: number) => {
//         setDesktopImages((prev) => prev.filter((_, i) => i !== index));
//         setDesktopImagePreviews((prev) => {
//             URL.revokeObjectURL(prev[index]);
//             return prev.filter((_, i) => i !== index);
//         });
//     };

//     const uploadAllImages = async () => {
//         if (!createdItemId) {
//             toast.error("No item created yet");
//             return;
//         }

//         setIsUploading(true);

//         try {
//             // Upload desktop images if any
//             if (desktopImages.length > 0) {
//                 let successCount = 0;

//                 // Upload images one by one
//                 for (let i = 0; i < desktopImages.length; i++) {
//                     const image = desktopImages[i];

//                     try {
//                         // Create FormData with single image
//                         const formData = new FormData();
//                         formData.append("lostImage", image);

//                         console.log(`Uploading image ${i + 1}/${desktopImages.length}:`, image.name);

//                         await uploadLostItemImage({
//                             id: createdItemId,
//                             formData: formData,
//                         }).unwrap();

//                         successCount++;

//                         // Add a small delay between uploads to avoid overwhelming the server
//                         if (i < desktopImages.length - 1) {
//                             await new Promise((resolve) => setTimeout(resolve, 300));
//                         }
//                     } catch (uploadError: any) {
//                         console.error(`Error uploading image ${i + 1}:`, uploadError);

//                         if (uploadError?.error?.status === "FETCH_ERROR" || uploadError?.status === "FETCH_ERROR") {
//                             toast.error(`Cannot upload image ${i + 1}: Server connection failed`);
//                         } else {
//                             toast.error(`Failed to upload image ${i + 1}: ${uploadError?.data?.message || "Unknown error"}`);
//                         }
//                     }
//                 }

//                 if (successCount > 0) {
//                     toast.success(`${successCount} out of ${desktopImages.length} image(s) uploaded successfully!`);
//                 }
//             } else {
//                 toast.info("No desktop images selected to upload");
//             }

//             setDesktopImages([]);
//             desktopImagePreviews.forEach((url) => URL.revokeObjectURL(url));
//             setDesktopImagePreviews([]);

//             // Navigate to lost items list
//             toast.success("Lost item process completed!");

//             // Add a small delay before navigation to ensure everything is saved
//             setTimeout(() => {
//                 router.push("/dashboard/lost-items-list");
//             }, 500);
//         } catch (error: any) {
//             console.error("Save changes error:", error);
//             toast.error("An unexpected error occurred. Please try again.");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const [shouldCloseQRModal, setShouldCloseQRModal] = useState(false);

//     const initializeSocketConnection = (itemId: string) => {
//         console.log(`Socket listening on: getImages::${itemId}`);

//         if (socketRef.current) {
//             socketRef.current.disconnect();
//         }

//         const socket = io(baseURL, {
//             transports: ["websocket", "polling"],
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 1000,
//         });

//         socket.on("connect", () => {
//             console.log("Socket connected:", socket.id);
//         });

//         socket.on("connect_error", (error) => {
//             console.error("Socket connection error:", error);
//             toast.error("Cannot connect to real-time server. Mobile uploads may not work.");
//         });

//         socket.on(`getImages::${itemId}`, (data) => {
//             console.log("Received socket data:", data);
//             setShouldCloseQRModal(true);
//             if (data && data.images && Array.isArray(data.images)) {
//                 setSocketImages((prev) => {
//                     const newImages = [...prev];
//                     data.images.forEach((imagePath: string) => {
//                         if (!newImages.includes(imagePath)) {
//                             newImages.push(imagePath);
//                         }
//                     });

//                     if (newImages.length > prev.length) {
//                         toast.success(`${newImages.length - prev.length} new image(s) uploaded from mobile!`);
//                     }

//                     return newImages;
//                 });
//             }
//             router.push("/dashboard/lost-items-list");
//         });
//         // router.push("/dashboard/lost-items-list");
//         socketRef.current = socket;
//     };

//     const handleQRModalClose = () => {
//         setShouldCloseQRModal(false);
//     };

//     const handleSaveChanges = () => {
//         uploadAllImages();
//     };

//     useEffect(() => {
//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.disconnect();
//             }
//             desktopImagePreviews.forEach((url) => URL.revokeObjectURL(url));
//         };
//     }, [desktopImagePreviews]);

//     return (
//         <div className="p-6 max-w-6xl mx-auto">
//             <div className="mb-8">
//                 <h1 className="text-2xl font-bold text-[#3A3A3A]">{currentStep < 3 ? "Add New Lost Item" : "Upload Images"}</h1>
//                 <p className="text-[#7C8493]">
//                     {currentStep === 1 && "Fill in the item details"}
//                     {currentStep === 2 && "Add guest information (optional)"}
//                     {currentStep === 3 && "Upload images from desktop or mobile"}
//                 </p>
//             </div>

//             <div className="flex gap-6">
//                 <div className="w-16 shrink-0">
//                     <div className="relative h-full">
//                         <div className="relative z-10 text-2xl font-bold flex items-center justify-center w-12 h-12 rounded-full bg-transparent border-4 border-[#0096FF] text-[#3A3A3A] mx-auto">{currentStep}</div>
//                         <div className="absolute left-1/2 top-14 bottom-0 w-1 bg-[#0096FF] transform -translate-x-1/2" />
//                     </div>
//                 </div>

//                 <div className="flex-1">
//                     {currentStep === 1 && (
//                         <div className="space-y-6">
//                             <div className="space-y-4">
//                                 <h3 className="text-2xl font-bold text-[#3A3A3A]">Item Details</h3>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="itemName">Item name</Label>
//                                     <Input id="itemName" placeholder="Enter item name" {...register("itemName")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                     {errors.itemName && <p className="text-red-500 text-sm">{errors.itemName.message}</p>}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="itemDescription">Item Description</Label>
//                                     <Textarea id="itemDescription" placeholder="Describe the item" {...register("itemDescription")} className="bg-[#E6EAEF] p-4 min-h-[100px] resize-vertical" disabled={isSubmitting} />
//                                     {errors.itemDescription && <p className="text-red-500 text-sm">{errors.itemDescription.message}</p>}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="dateFound">Date</Label>
//                                     <Input id="dateFound" type="date" {...register("dateFound")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                     {errors.dateFound && <p className="text-red-500 text-sm">{errors.dateFound.message}</p>}
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="locationFound">Where did you find it?</Label>
//                                     <Input id="locationFound" placeholder="Enter location where item was found" {...register("locationFound")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                     {/* <div className="relative">
//                                         <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#0096FF]" />
//                                     </div> */}
//                                     {errors.locationFound && <p className="text-red-500 text-sm">{errors.locationFound.message}</p>}
//                                 </div>
//                             </div>

//                             <div className="flex justify-end pt-6">
//                                 <Button type="button" onClick={nextStep} className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded flex items-center gap-2" disabled={isSubmitting}>
//                                     Next
//                                     <ChevronRight className="h-4 w-4" />
//                                 </Button>
//                             </div>
//                         </div>
//                     )}

//                     {currentStep === 2 && (
//                         <div className="space-y-6">
//                             <div className="space-y-4">
//                                 <h3 className="text-2xl font-bold text-[#3A3A3A]">Do you know the owner?</h3>
//                                 <p className="text-sm text-gray-600">(Guest details are optional - leave blank if unknown)</p>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="guestName">Guest name</Label>
//                                     <Input id="guestName" placeholder="Enter guest name (optional)" {...register("guestName")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="guestEmail">Guest email</Label>
//                                         <Input id="guestEmail" type="email" placeholder="Enter guest email (optional)" {...register("guestEmail")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="guestPhone">Guest phone</Label>
//                                         <Input id="guestPhone" placeholder="Enter guest phone number (optional)" {...register("guestPhone")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="guestReservationName">Guest reservation name</Label>
//                                         <Input id="guestReservationName" placeholder="Enter reservation name (optional)" {...register("guestReservationName")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="guestRoomNumber">Guest room number</Label>
//                                         <Input id="guestRoomNumber" placeholder="Enter room number (optional)" {...register("guestRoomNumber")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="checkoutDate">Checkout date</Label>
//                                     <Input id="checkoutDate" type="date" {...register("checkoutDate")} className="bg-[#E6EAEF] p-6" disabled={isSubmitting} />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="note">Note (Optional)</Label>
//                                     <Textarea id="note" placeholder="Add any additional notes..." {...register("note")} className="bg-[#E6EAEF] p-6 min-h-[100px] resize-vertical" disabled={isSubmitting} />
//                                 </div>
//                             </div>

//                             <div className="flex justify-between pt-6">
//                                 <Button type="button" variant="outline" onClick={prevStep} className="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors py-2 px-6 rounded flex items-center gap-2" disabled={isSubmitting}>
//                                     <ChevronLeft className="h-4 w-4" />
//                                     Back
//                                 </Button>
//                                 <Button type="button" onClick={() => onSubmit(watch())} className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded flex items-center gap-2" disabled={isSubmitting}>
//                                     {isSubmitting ? (
//                                         <>
//                                             <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//                                             Processing...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Next
//                                             <ChevronRight className="h-4 w-4" />
//                                         </>
//                                     )}
//                                 </Button>
//                             </div>
//                         </div>
//                     )}

//                     {currentStep === 3 && createdItemId && (
//                         <div className="space-y-6">
//                             <div className="space-y-4">
//                                 <h3 className="text-2xl font-bold text-[#3A3A3A]">Upload Images</h3>

//                                 <div className="space-y-3">
//                                     <Label className="text-sm font-medium">Add an Image</Label>
//                                     <div className="border border-dashed border-[#3A3A3A] rounded-[12px] p-5 text-center hover:border-gray-400 transition-colors">
//                                         <div className="space-y-6">
//                                             <p className="text-sm text-[#3A3A3A]">
//                                                 Drag & drop Or <span className="text-[#0096ff]">Browse</span> Photos (up to 3)
//                                             </p>
//                                             <div className="flex items-center justify-center">
//                                                 <Image src="/dashboard/business/upload2.svg" alt="Upload Picture" width={52} height={52} />
//                                             </div>

//                                             <div className="flex flex-col items-center gap-3">
//                                                 <label className="cursor-pointer">
//                                                     <div className={`flex items-center justify-center gap-2 ${desktopImages.length >= 3 ? "bg-gray-400 cursor-not-allowed" : "bg-[#0096FF] hover:bg-blue-600"} text-white transition-colors py-2 px-6 rounded`}>
//                                                         <Upload className="h-4 w-4 mr-2" />
//                                                         Browse Photos
//                                                     </div>
//                                                     <input type="file" accept="image/*" multiple onChange={handleDesktopImageUpload} className="hidden" disabled={desktopImages.length >= 3 || isUploading} />
//                                                 </label>
//                                             </div>

//                                             {desktopImages.length > 0 && (
//                                                 <div className="flex flex-wrap gap-2 justify-center">
//                                                     {desktopImagePreviews.map((preview, index) => (
//                                                         <div key={index} className="relative">
//                                                             <div className="w-24 h-24 rounded-md overflow-hidden border">
//                                                                 <Image src={preview} alt={`Preview ${index + 1}`} width={96} height={96} className="w-full h-full object-cover" />
//                                                             </div>
//                                                             <button type="button" onClick={() => removeDesktopImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600" disabled={isUploading}>
//                                                                 <X className="h-4 w-4" />
//                                                             </button>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}

//                                             <div className="pt-4 border-t">
//                                                 <p className="text-sm text-[#3A3A3A] mb-3">Or scan QR code for mobile upload</p>
//                                                 <QRScannerModal lostItemId={createdItemId} onMobileUploadComplete={shouldCloseQRModal ? handleQRModalClose : undefined} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {socketImages.length > 0 && (
//                                     <div className="space-y-3 mt-6">
//                                         <Label className="text-sm font-medium">Uploaded from Mobile</Label>
//                                         <p className="text-xs text-gray-500 mb-2">{socketImages.length} image(s) received from mobile device</p>
//                                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                                             {socketImages.map((imagePath, index) => (
//                                                 <div key={index} className="relative">
//                                                     <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
//                                                         <img
//                                                             src={`${baseURL}${imagePath}`}
//                                                             alt={`Mobile Upload ${index + 1}`}
//                                                             className="w-full h-full object-cover"
//                                                             onError={(e) => {
//                                                                 // Fallback if image fails to load
//                                                                 (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
//                                                             }}
//                                                         />
//                                                     </div>
//                                                     <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Mobile</div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex justify-between items-center pt-6">
//                                 <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors py-2 px-6 rounded flex items-center gap-2" disabled={isUploading}>
//                                     <ChevronLeft className="h-4 w-4" />
//                                     Back
//                                 </Button>
//                                 <div className="flex gap-4">
//                                     {/* <Button type="button" variant="outline" onClick={handleCancel} className="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors py-2 px-6 rounded" disabled={isUploading}>
//                                         Cancel
//                                     </Button> */}
//                                     <Button type="button" onClick={handleSaveChanges} className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded" disabled={isUploading}>
//                                         {isUploading ? (
//                                             <>
//                                                 <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
//                                                 Saving...
//                                             </>
//                                         ) : (
//                                             "Save changes"
//                                         )}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddLostItemPage;

"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, ChevronRight, ChevronLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import QRScannerModal from "@/components/dashboard/lost-items-list/QRScannerModal";
import { z } from "zod";
import { toast } from "sonner";
import {
  useCreateLostItemMutation,
  useUploadLostItemImageMutation,
} from "@/redux/features/lostItem/lostitemApi";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";

const formSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  itemDescription: z.string().min(1, "Item description is required"),
  dateFound: z
    .string()
    .min(1, "Date is required")
    .refine((date) => {
      return !isNaN(Date.parse(date));
    }, "Invalid date format"),
  locationFound: z.string().min(1, "Found location is required"),
  guestName: z.string().optional(),
  guestEmail: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  guestPhone: z.string().optional(),
  guestReservationName: z.string().optional(),
  guestRoomNumber: z.string().optional(),
  checkoutDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return !isNaN(Date.parse(date));
    }, "Invalid date format"),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AddLostItemPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [desktopImages, setDesktopImages] = useState<File[]>([]);
  const [desktopImagePreviews, setDesktopImagePreviews] = useState<string[]>(
    [],
  );
  const [socketImages, setSocketImages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";

  const [createLostItem] = useCreateLostItemMutation();
  const [uploadLostItemImage] = useUploadLostItemImageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      itemDescription: "",
      dateFound: new Date().toISOString().split("T")[0],
      locationFound: "",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestReservationName: "",
      guestRoomNumber: "",
      checkoutDate: "",
      note: "",
    },
  });

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger([
        "itemName",
        "itemDescription",
        "dateFound",
        "locationFound",
      ]);
      if (isValid) {
        setCurrentStep(2);
      } else {
        toast.error("Please fill in all required fields correctly");
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const formattedData = {
        itemName: data.itemName,
        itemDescription: data.itemDescription,
        dateFound: new Date(data.dateFound).toISOString(),
        locationFound: data.locationFound,
        guestName: data.guestName || undefined,
        guestEmail: data.guestEmail || undefined,
        guestPhone: data.guestPhone || undefined,
        guestReservationName: data.guestReservationName || undefined,
        guestRoomNumber: data.guestRoomNumber || undefined,
        checkoutDate: data.checkoutDate
          ? new Date(data.checkoutDate).toISOString()
          : undefined,
        note: data.note || undefined,
      };

      const createResponse = await createLostItem(formattedData).unwrap();
      const lostItemId = createResponse.data._id;
      setCreatedItemId(lostItemId);

      toast.success("Lost item created successfully!");
      setCurrentStep(3);
      initializeSocketConnection(lostItemId);
    } catch (error: any) {
      console.error("Error creating lost item:", error);
      if (error?.data?.errorMessages) {
        error.data.errorMessages.forEach((err: any) => {
          toast.error(`${err.path}: ${err.message}`);
        });
      } else {
        toast.error(
          error?.data?.message ||
            "Failed to create lost item. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDesktopImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 3 - desktopImages.length);
    setDesktopImages((prev) => [...prev, ...newImages]);

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setDesktopImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeDesktopImage = (index: number) => {
    setDesktopImages((prev) => prev.filter((_, i) => i !== index));
    setDesktopImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadAllImages = async () => {
    if (!createdItemId) {
      toast.error("No item created yet");
      return;
    }

    setIsUploading(true);

    try {
      // Upload desktop images if any
      if (desktopImages.length > 0) {
        // Create ONE FormData object
        const formData = new FormData();

        // Append ALL images to the SAME FormData with SAME field name
        desktopImages.forEach((image) => {
          formData.append("lostImage", image); // All images go here
        });

        console.log(
          `Uploading ${desktopImages.length} images in ONE SINGLE request to: /lost-item/upload-image/${createdItemId}`,
        );

        // Make ONE API call with ALL images
        const uploadResponse = await uploadLostItemImage({
          id: createdItemId,
          formData: formData,
        }).unwrap();

        console.log("Upload response:", uploadResponse);

        if (uploadResponse.success || uploadResponse.data) {
          toast.success(
            `${desktopImages.length} image(s) uploaded successfully!`,
          );
        } else {
          throw new Error(uploadResponse.message || "Upload failed");
        }
      } else {
        toast.info("No desktop images selected to upload");
      }

      // Clear images
      setDesktopImages([]);
      desktopImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setDesktopImagePreviews([]);

      // Navigate to lost items list
      toast.success("Lost item process completed!");
      setTimeout(() => {
        router.push("/dashboard/lost-items-list");
      }, 500);
    } catch (error: any) {
      console.error("Save changes error:", error);
      toast.error(
        error?.data?.message ||
          "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const [shouldCloseQRModal, setShouldCloseQRModal] = useState(false);

  const initializeSocketConnection = (itemId: string) => {
    console.log(`Socket listening on: getImages::${itemId}`);

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(baseURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error(
        "Cannot connect to real-time server. Mobile uploads may not work.",
      );
    });

    socket.on(`getImages::${itemId}`, (data) => {
      console.log("Received socket data:", data);
      setShouldCloseQRModal(true);
      if (data && data.images && Array.isArray(data.images)) {
        setSocketImages((prev) => {
          const newImages = [...prev];
          data.images.forEach((imagePath: string) => {
            if (!newImages.includes(imagePath)) {
              newImages.push(imagePath);
            }
          });

          if (newImages.length > prev.length) {
            toast.success(
              `${newImages.length - prev.length} new image(s) uploaded from mobile!`,
            );
          }

          return newImages;
        });
      }
      router.push("/dashboard/lost-items-list");
    });

    socketRef.current = socket;
  };

  const handleQRModalClose = () => {
    setShouldCloseQRModal(false);
  };

  const handleSaveChanges = () => {
    uploadAllImages();
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      desktopImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [desktopImagePreviews]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#3A3A3A]">
          {currentStep < 3 ? "Add New Lost Item" : "Upload Images"}
        </h1>
        <p className="text-[#7C8493]">
          {currentStep === 1 && "Fill in the item details"}
          {currentStep === 2 && "Add guest information (optional)"}
          {currentStep === 3 && "Upload images from desktop or mobile"}
        </p>
      </div>

      <div className="flex gap-6">
        <div className="w-16 shrink-0">
          <div className="relative h-full">
            <div className="relative z-10 text-2xl font-bold flex items-center justify-center w-12 h-12 rounded-full bg-transparent border-4 border-[#0096FF] text-[#3A3A3A] mx-auto">
              {currentStep}
            </div>
            <div className="absolute left-1/2 top-14 bottom-0 w-1 bg-[#0096FF] transform -translate-x-1/2" />
          </div>
        </div>

        <div className="flex-1">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#3A3A3A]">
                  Item Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="itemName">Item name</Label>
                  <Input
                    id="itemName"
                    placeholder="Enter item name"
                    {...register("itemName")}
                    className="bg-[#E6EAEF] p-6"
                    disabled={isSubmitting}
                  />
                  {errors.itemName && (
                    <p className="text-red-500 text-sm">
                      {errors.itemName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Item Description</Label>
                  <Textarea
                    id="itemDescription"
                    placeholder="Describe the item"
                    {...register("itemDescription")}
                    className="bg-[#E6EAEF] p-4 min-h-[100px] resize-vertical"
                    disabled={isSubmitting}
                  />
                  {errors.itemDescription && (
                    <p className="text-red-500 text-sm">
                      {errors.itemDescription.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFound">Date</Label>
                  <Input
                    id="dateFound"
                    type="date"
                    {...register("dateFound")}
                    className="bg-[#E6EAEF] p-6"
                    disabled={isSubmitting}
                  />
                  {errors.dateFound && (
                    <p className="text-red-500 text-sm">
                      {errors.dateFound.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationFound">Where did you find it?</Label>
                  <Input
                    id="locationFound"
                    placeholder="Enter location where item was found"
                    {...register("locationFound")}
                    className="bg-[#E6EAEF] p-6"
                    disabled={isSubmitting}
                  />
                  {errors.locationFound && (
                    <p className="text-red-500 text-sm">
                      {errors.locationFound.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#3A3A3A]">
                  Do you know the owner?
                </h3>
                <p className="text-sm text-gray-600">
                  (Guest details are optional - leave blank if unknown)
                </p>

                <div className="space-y-2">
                  <Label htmlFor="guestName">Guest name</Label>
                  <Input
                    id="guestName"
                    placeholder="Enter guest name (optional)"
                    {...register("guestName")}
                    className="bg-[#E6EAEF] p-6"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestEmail">Guest email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      placeholder="Enter guest email (optional)"
                      {...register("guestEmail")}
                      className="bg-[#E6EAEF] p-6"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestPhone">Guest phone</Label>
                    <Input
                      id="guestPhone"
                      placeholder="Enter guest phone number (optional)"
                      {...register("guestPhone")}
                      className="bg-[#E6EAEF] p-6"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestReservationName">
                      Guest reservation name
                    </Label>
                    <Input
                      id="guestReservationName"
                      placeholder="Enter reservation name (optional)"
                      {...register("guestReservationName")}
                      className="bg-[#E6EAEF] p-6"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestRoomNumber">Guest room number</Label>
                    <Input
                      id="guestRoomNumber"
                      placeholder="Enter room number (optional)"
                      {...register("guestRoomNumber")}
                      className="bg-[#E6EAEF] p-6"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkoutDate">Checkout date</Label>
                  <Input
                    id="checkoutDate"
                    type="date"
                    {...register("checkoutDate")}
                    className="bg-[#E6EAEF] p-6"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add any additional notes..."
                    {...register("note")}
                    className="bg-[#E6EAEF] p-6 min-h-[100px] resize-vertical"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors py-2 px-6 rounded flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => onSubmit(watch())}
                  className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && createdItemId && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[#3A3A3A]">
                  Upload Images
                </h3>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Add an Image</Label>
                  <div className="border border-dashed border-[#3A3A3A] rounded-[12px] p-5 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-6">
                      <p className="text-sm text-[#3A3A3A]">
                        Drag & drop Or{" "}
                        <span className="text-[#0096ff]">Browse</span> Photos
                        (up to 3)
                      </p>
                      <div className="flex items-center justify-center">
                        <Image
                          src="/dashboard/business/upload2.svg"
                          alt="Upload Picture"
                          width={52}
                          height={52}
                        />
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        <label className="cursor-pointer">
                          <div
                            className={`flex items-center justify-center gap-2 ${desktopImages.length >= 3 ? "bg-gray-400 cursor-not-allowed" : "bg-[#0096FF] hover:bg-blue-600"} text-white transition-colors py-2 px-6 rounded`}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Browse Photos
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleDesktopImageUpload}
                            className="hidden"
                            disabled={desktopImages.length >= 3 || isUploading}
                          />
                        </label>
                      </div>

                      {desktopImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {desktopImagePreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <div className="w-24 h-24 rounded-md overflow-hidden border">
                                <Image
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDesktopImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                disabled={isUploading}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <p className="text-sm text-[#3A3A3A] mb-3">
                          Or scan QR code for mobile upload
                        </p>
                        <QRScannerModal
                          lostItemId={createdItemId}
                          onMobileUploadComplete={
                            shouldCloseQRModal ? handleQRModalClose : undefined
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {socketImages.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <Label className="text-sm font-medium">
                      Uploaded from Mobile
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      {socketImages.length} image(s) received from mobile device
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {socketImages.map((imagePath, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                            <img
                              src={`${baseURL}${imagePath}`}
                              alt={`Mobile Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-image.jpg";
                              }}
                            />
                          </div>
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Mobile
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors py-2 px-6 rounded flex items-center gap-2"
                  disabled={isUploading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handleSaveChanges}
                    className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLostItemPage;
