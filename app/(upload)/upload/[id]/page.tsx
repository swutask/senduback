// "use client";
// import { useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import Image from "next/image";
// import { Label } from "@/components/ui/label";

// export default function MobileUploadPage() {
//     const params = useParams();
//     const itemId = params.id as string;

//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const cameraInputRef = useRef<HTMLInputElement>(null);

//     const [selectedImages, setSelectedImages] = useState<File[]>([]);
//     const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//     const [isUploading, setIsUploading] = useState(false);

//     // Handle camera capture using device camera
//     const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;

//         if (selectedImages.length >= 3) {
//             toast.error("Maximum 3 photos allowed");
//             return;
//         }

//         const file = files[0];
//         const newFiles = [file];
//         setSelectedImages((prev) => [...prev, ...newFiles]);

//         const newPreview = URL.createObjectURL(file);
//         setImagePreviews((prev) => [...prev, newPreview]);

//         toast.success("Photo captured! You can upload it.");

//         // Reset camera input
//         if (cameraInputRef.current) {
//             cameraInputRef.current.value = "";
//         }
//     };

//     const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files) return;

//         const newImages = Array.from(files).slice(0, 3 - selectedImages.length);
//         const newFiles = newImages.map((file) => file);
//         setSelectedImages((prev) => [...prev, ...newFiles]);

//         const newPreviews = newImages.map((file) => URL.createObjectURL(file));
//         setImagePreviews((prev) => [...prev, ...newPreviews]);
//     };

//     const removeImage = (index: number) => {
//         setSelectedImages((prev) => prev.filter((_, i) => i !== index));
//         setImagePreviews((prev) => {
//             URL.revokeObjectURL(prev[index]);
//             return prev.filter((_, i) => i !== index);
//         });
//     };

//     const uploadImages = async () => {
//         if (selectedImages.length === 0 || !itemId) {
//             toast.error("Please select images to upload");
//             return;
//         }

//         setIsUploading(true);

//         try {
//             // Upload images one by one
//             let successCount = 0;

//             for (let i = 0; i < selectedImages.length; i++) {
//                 const image = selectedImages[i];

//                 try {
//                     // Create FormData with SINGLE image
//                     const formData = new FormData();

//                     // Use 'lostImage' as field name
//                     formData.append("lostImage", image);

//                     console.log(`Uploading image ${i + 1}/${selectedImages.length}:`, image.name);

//                     const baseURL = process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";
//                     const uploadResponse = await fetch(`${baseURL}/api/v1/lost-item/upload-image/${itemId}`, {
//                         method: "POST",
//                         body: formData,
//                     });

//                     if (!uploadResponse.ok) {
//                         const errorData = await uploadResponse.json().catch(() => ({}));
//                         throw new Error(errorData.message || `Upload failed: ${uploadResponse.status}`);
//                     }

//                     const result = await uploadResponse.json();
//                     console.log(`Image ${i + 1} upload result:`, result);

//                     if (result.success || result.data) {
//                         successCount++;
//                     } else {
//                         throw new Error(result.message || "Upload failed");
//                     }

//                     // Small delay between uploads
//                     if (i < selectedImages.length - 1) {
//                         await new Promise((resolve) => setTimeout(resolve, 500));
//                     }
//                 } catch (error: any) {
//                     console.error(`Error uploading image ${i + 1}:`, error);
//                     toast.error(`Failed to upload: ${selectedImages[i].name}`);
//                 }
//             }

//             if (successCount > 0) {
//                 toast.success(`${successCount} out of ${selectedImages.length} image(s) uploaded successfully!`);

//                 // Clear images after successful upload
//                 setSelectedImages([]);
//                 imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//                 setImagePreviews([]);
//             } else {
//                 toast.error("No images could be uploaded. Please try again.");
//             }
//         } catch (error: any) {
//             console.error("Upload error:", error);
//             toast.error("Failed to upload images");
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     return (
//         <div className="p-6 max-w-md mx-auto">
//             <div className="mb-8">
//                 <h1 className="text-2xl font-bold text-[#3A3A3A]">Upload Images</h1>
//                 <p className="text-[#7C8493]">Take photos or upload from gallery</p>
//             </div>

//             <div className="space-y-6">
//                 {/* Take Photo using Device Camera */}
//                 <div className="space-y-3">
//                     <Label className="text-sm font-medium text-[#3A3A3A]">Take Photo</Label>
//                     <div className="border border-dashed border-[#3A3A3A] rounded-[12px] p-5 text-center hover:border-gray-400 transition-colors">
//                         <div className="space-y-4">
//                             <Camera className="h-12 w-12 mx-auto text-gray-400" />
//                             <p className="text-sm text-[#3A3A3A]">Use your camera to take a photo</p>

//                             {/* Hidden camera input */}
//                             <input
//                                 ref={cameraInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 capture="environment" // Opens camera with rear camera by default
//                                 onChange={handleCameraCapture}
//                                 className="hidden"
//                                 disabled={selectedImages.length >= 3 || isUploading}
//                             />

//                             <Button onClick={() => cameraInputRef.current?.click()} disabled={selectedImages.length >= 3 || isUploading} className="bg-[#0096FF] text-white hover:bg-blue-600 py-3 px-8 rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed">
//                                 Open Camera
//                             </Button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Upload from Gallery */}
//                 <div className="space-y-3">
//                     <Label className="text-sm font-medium text-[#3A3A3A]">Upload from Gallery</Label>
//                     <div className="border border-dashed border-[#3A3A3A] rounded-[12px] p-5 text-center hover:border-gray-400 transition-colors">
//                         <div className="space-y-6">
//                             <p className="text-sm text-[#3A3A3A]">
//                                 Tap to <span className="text-[#0096ff]">Browse</span> Photos (up to 3)
//                             </p>
//                             <div className="flex items-center justify-center">
//                                 <Image src="/dashboard/business/upload2.svg" alt="Upload Picture" width={52} height={52} />
//                             </div>

//                             <div className="flex flex-col items-center gap-3">
//                                 <label className="cursor-pointer">
//                                     <div className={`flex items-center justify-center gap-2 ${selectedImages.length >= 3 ? "bg-gray-400 cursor-not-allowed" : "bg-[#0096FF] hover:bg-blue-600"} text-white transition-colors py-3 px-8 rounded-lg text-base`}>
//                                         <Upload className="h-5 w-5 mr-2" />
//                                         Browse Photos
//                                     </div>
//                                     <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" disabled={selectedImages.length >= 3 || isUploading} />
//                                 </label>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Selected Images Preview */}
//                 {selectedImages.length > 0 && (
//                     <div className="space-y-3">
//                         <Label className="text-sm font-medium text-[#3A3A3A]">Selected Images ({selectedImages.length}/3)</Label>
//                         <div className="flex flex-wrap gap-2 justify-center">
//                             {imagePreviews.map((preview, index) => (
//                                 <div key={index} className="relative">
//                                     <div className="w-24 h-24 rounded-md overflow-hidden border">
//                                         <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
//                                     </div>
//                                     <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600" disabled={isUploading}>
//                                         <X className="h-4 w-4" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Upload Button */}
//                         <div className="flex justify-center pt-4">
//                             <Button onClick={uploadImages} className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg text-base" disabled={isUploading}>
//                                 {isUploading ? (
//                                     <>
//                                         <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
//                                         Uploading...
//                                     </>
//                                 ) : (
//                                     `Upload ${selectedImages.length} Image${selectedImages.length !== 1 ? "s" : ""}`
//                                 )}
//                             </Button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Status Info */}
//             <div className="mt-8 text-center text-sm text-gray-500">
//                 <p>
//                     Item ID: <span className="font-mono">{itemId}</span>
//                 </p>
//                 <p className="mt-1">Images will appear on desktop automatically</p>
//             </div>
//         </div>
//     );
// }

"use client";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";

export default function MobileUploadPage() {
  const params = useParams();
  const itemId = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Handle camera capture using device camera
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (selectedImages.length >= 3) {
      toast.error("Maximum 3 photos allowed");
      return;
    }

    const file = files[0];
    const newFiles = [file];
    setSelectedImages((prev) => [...prev, ...newFiles]);

    const newPreview = URL.createObjectURL(file);
    setImagePreviews((prev) => [...prev, newPreview]);

    toast.success("Photo captured! You can upload it.");

    // Reset camera input
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, 3 - selectedImages.length);
    const newFiles = newImages.map((file) => file);
    setSelectedImages((prev) => [...prev, ...newFiles]);

    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0 || !itemId) {
      toast.error("Please select images to upload");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData with MULTIPLE images
      const formData = new FormData();

      // Append each image with the same field name but multiple values
      selectedImages.forEach((image, index) => {
        formData.append("lostImage", image);
        // OR if backend expects array: formData.append("lostImages[]", image);
      });

      console.log(`Uploading ${selectedImages.length} images at once...`);

      const baseURL =
        process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";
      const uploadResponse = await fetch(
        `${baseURL}/api/v1/lost-item/upload-image/${itemId}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed: ${uploadResponse.status}`,
        );
      }

      const result = await uploadResponse.json();
      console.log("Upload result:", result);

      if (result.success || result.data) {
        toast.success(
          `${selectedImages.length} image(s) uploaded successfully!`,
        );

        // Clear images after successful upload
        setSelectedImages([]);
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setImagePreviews([]);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload images");

      // If single upload fails, try uploading one by one as fallback
      if (error.message.includes("multiple") || selectedImages.length > 1) {
        toast.info("Trying alternative upload method...");
        await uploadImagesOneByOne();
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Fallback method: Upload images one by one
  const uploadImagesOneByOne = async () => {
    let successCount = 0;

    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];

      try {
        const formData = new FormData();
        formData.append("lostImage", image);

        const baseURL =
          process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";
        const uploadResponse = await fetch(
          `${baseURL}/api/v1/lost-item/upload-image/${itemId}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (uploadResponse.ok) {
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}`);
      }
    }

    if (successCount > 0) {
      toast.success(
        `${successCount} out of ${selectedImages.length} image(s) uploaded successfully!`,
      );
      // Clear images
      setSelectedImages([]);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews([]);
    } else {
      toast.error("Failed to upload any images");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#3A3A3A]">Upload Images</h1>
        <p className="text-[#7C8493]">Take photos or upload from gallery</p>
      </div>

      <div className="space-y-6">
        {/* Take Photo using Device Camera */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-[#3A3A3A]">
            Take Photo
          </Label>
          <div className="border border-dashed border-[#3A3A3A] rounded-[12px] p-5 text-center hover:border-gray-400 transition-colors">
            <div className="space-y-4">
              <Camera className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-sm text-[#3A3A3A]">
                Use your camera to take a photo
              </p>

              {/* Hidden camera input */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
                disabled={selectedImages.length >= 3 || isUploading}
              />

              <Button
                onClick={() => cameraInputRef.current?.click()}
                disabled={selectedImages.length >= 3 || isUploading}
                className="bg-[#0096FF] text-white hover:bg-blue-600 py-3 px-8 rounded-lg text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Open Camera
              </Button>
            </div>
          </div>
        </div>

        {/* Upload from Gallery */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-[#3A3A3A]">
            Upload from Gallery
          </Label>
          <div className="border border-dashed border-[#3A3A3A] rounded-[12px] p-5 text-center hover:border-gray-400 transition-colors">
            <div className="space-y-6">
              <p className="text-sm text-[#3A3A3A]">
                Tap to <span className="text-[#0096ff]">Browse</span> Photos (up
                to 3)
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
                    className={`flex items-center justify-center gap-2 ${selectedImages.length >= 3 ? "bg-gray-400 cursor-not-allowed" : "bg-[#0096FF] hover:bg-blue-600"} text-white transition-colors py-3 px-8 rounded-lg text-base`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Browse Photos
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={selectedImages.length >= 3 || isUploading}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Images Preview */}
        {selectedImages.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#3A3A3A]">
              Selected Images ({selectedImages.length}/3)
            </Label>
            <div className="flex flex-wrap gap-2 justify-center">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <div className="w-24 h-24 rounded-md overflow-hidden border">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={uploadImages}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg text-base"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Uploading...
                  </>
                ) : (
                  `Upload ${selectedImages.length} Image${selectedImages.length !== 1 ? "s" : ""}`
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Item ID: <span className="font-mono">{itemId}</span>
        </p>
        <p className="mt-1">Images will appear on desktop automatically</p>
      </div>
    </div>
  );
}
