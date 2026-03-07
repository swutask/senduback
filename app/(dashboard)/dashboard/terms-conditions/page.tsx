// "use client";
// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle } from "lucide-react";
// import dynamic from "next/dynamic";

// // Dynamically import Jodit Editor to avoid SSR issues
// const JoditEditor = dynamic(() => import("jodit-react"), {
//     ssr: false,
//     loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>,
// });

// const TermsConditionsPage = () => {
//     const [content, setContent] = useState("<p>Write or paste your Terms & Conditions here...</p>");
//     const [isSaved, setIsSaved] = useState(false);
//     const editor = useRef(null);

//     const config = {
//         readonly: false,
//         height: 400,
//         toolbarAdaptive: false,
//         toolbarSticky: true,
//         buttons: ["bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "outdent", "indent", "|", "font", "fontsize", "brush", "|", "align", "|", "link", "|", "undo", "redo", "|", "find", "selectAll"],
//         removeButtons: ["image", "file", "video", "source"],
//     };

//     const handleSave = () => {
//         console.log("Saved content:", content);
//         setIsSaved(true);
//         setTimeout(() => setIsSaved(false), 3000);
//     };

//     // Fix for cursor issue - only update content on blur
//     const handleBlur = (newContent: string) => {
//         setContent(newContent);
//     };

//     return (
//         <div className="p-6 space-y-6">
//             {/* Header */}
//             <div className="space-y-2">
//                 <h1 className="text-3xl font-bold text-[#25324B]">Manage Terms & Conditions</h1>
//                 <p className="text-[#7C8493] text-lg">Use this section to write or update the Terms and Conditions for your app. These terms will be displayed to users within the app and must be accepted during registration or major updates.</p>
//             </div>

//             {/* Success Message */}
//             {isSaved && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                     <p className="text-green-800 text-sm font-medium">Your Terms & Conditions have been successfully updated and will now appear in the app.</p>
//                 </div>
//             )}

//             {/* Single Card with everything in one column */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardContent className="p-6 space-y-6">
//                     <div className="space-y-2">
//                         <p className="text-sm text-gray-700">Write or paste your Terms & Conditions here...</p>
//                         <div className="border border-gray-300 rounded-lg overflow-hidden">
//                             <JoditEditor ref={editor} value={content} config={config} onBlur={handleBlur} />
//                         </div>
//                     </div>

//                     <div className="flex justify-between items-center">
//                         <div className="space-y-1">
//                             <p className="text-sm text-gray-700">Last Updated On : January 15, 2024</p>
//                         </div>

//                         <Button onClick={handleSave} className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded">
//                             Save Terms & Conditions
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default TermsConditionsPage;

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  useGetTermsAndConditionsQuery,
  useCreateOrUpdatePublicContentMutation,
} from "@/redux/features/public/publicApi";

// Dynamically import Jodit Editor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
  ),
});

const TermsConditionsPage = () => {
  // Get terms and conditions
  const {
    data: termsData,
    isLoading,
    isError,
  } = useGetTermsAndConditionsQuery(undefined);

  // Update mutation
  const [updateTerms, { isLoading: isUpdating }] =
    useCreateOrUpdatePublicContentMutation();

  const [content, setContent] = useState(
    "<p>Loading Terms & Conditions...</p>",
  );
  const [lastUpdated, setLastUpdated] = useState("Loading...");

  const config = {
    readonly: false,
    height: 400,
    toolbarAdaptive: false,
    toolbarSticky: true,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "align",
      "|",
      "link",
      "|",
      "undo",
      "redo",
      "|",
      "find",
      "selectAll",
    ],
    removeButtons: ["image", "file", "video", "source"],
  };

  // Initialize with API data
  useEffect(() => {
    if (termsData?.success && termsData.data) {
      setContent(
        termsData.data.content ||
          "<p>Write or paste your Terms & Conditions here...</p>",
      );

      // Try to get last updated date from data, otherwise use current
      if (termsData.data.updatedAt) {
        const date = new Date(termsData.data.updatedAt);
        setLastUpdated(
          date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
      } else {
        setLastUpdated(
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
      }
    }
  }, [termsData]);

  const handleSave = async () => {
    const toastId = toast.loading("Saving Terms & Conditions...");

    try {
      const response = await updateTerms({
        type: "terms-and-condition",
        content: content,
      }).unwrap();

      if (response.success) {
        toast.success("Terms & Conditions updated successfully!", {
          id: toastId,
          description: "The changes will appear in the app immediately.",
        });

        // Update last updated date
        setLastUpdated(
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
      } else {
        toast.error(response.message || "Failed to update Terms & Conditions", {
          id: toastId,
        });
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error?.data?.message || "Failed to save. Please try again.", {
        id: toastId,
      });
    }
  };

  const handleBlur = (newContent: string) => {
    setContent(newContent);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">
            Manage Terms & Conditions
          </h1>
          <p className="text-[#7C8493] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">
            Manage Terms & Conditions
          </h1>
          <p className="text-[#7C8493] text-lg">
            Error loading Terms & Conditions. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">
          Manage Terms & Conditions
        </h1>
        <p className="text-[#7C8493] text-lg">
          Use this section to write or update the Terms and Conditions for your
          app. These terms will be displayed to users within the app and must be
          accepted during registration or major updates.
        </p>
      </div>

      {/* Single Card with everything in one column */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Write or paste your Terms & Conditions here...
            </p>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <JoditEditor
                value={content}
                config={config}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                Last Updated On: {lastUpdated}
              </p>
              {termsData?.data?.updatedAt && (
                <p className="text-xs text-gray-500">
                  Version: {new Date(termsData.data.updatedAt).getTime()}
                </p>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Terms & Conditions"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsConditionsPage;
