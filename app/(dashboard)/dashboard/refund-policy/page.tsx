"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateOrUpdatePublicContentMutation,
  useGetRefundPolicyQuery,
} from "@/redux/features/public/publicApi";
import { CheckCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Dynamically import Jodit Editor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
  ),
});

const RefundPolicyPage = () => {
  // Get refund policy
  const {
    data: policyData,
    isLoading,
    isError,
  } = useGetRefundPolicyQuery(undefined);

  // Update mutation
  const [updatePolicy, { isLoading: isUpdating }] =
    useCreateOrUpdatePublicContentMutation();

  const [content, setContent] = useState("<p>Loading Refund Policy...</p>");
  const [lastUpdated, setLastUpdated] = useState("January 15, 2024");
  const [isSaved, setIsSaved] = useState(false);

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
    if (policyData?.success && policyData.data) {
      setContent(
        policyData.data.content ||
          "<p>Write or paste your Refund Policy here...</p>",
      );

      // Try to get last updated date from data, otherwise use current
      if (policyData.data.updatedAt) {
        const date = new Date(policyData.data.updatedAt);
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
  }, [policyData]);

  const handleSave = async () => {
    const toastId = toast.loading("Saving Refund Policy...");

    try {
      const response = await updatePolicy({
        type: "refund-policy",
        content: content,
      }).unwrap();

      if (response.success) {
        setIsSaved(true);
        toast.success("Refund Policy updated successfully!", {
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

        // Hide success message after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        toast.error(response.message || "Failed to update Refund Policy", {
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
            Manage Refund Policy
          </h1>
          <p className="text-[#7C8493] text-lg">Loading Refund Policy...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">
            Manage Refund Policy
          </h1>
          <p className="text-[#7C8493] text-lg">
            Error loading Refund Policy. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-2xl p-5 shadow-lg">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">
          Manage Refund Policy
        </h1>
        <p className="text-[#7C8493] text-lg">
          Use this section to write or update the Refund Policy for your app.
          This policy will be displayed to users within the app and must be
          accepted during registration or major updates.
        </p>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800 text-sm font-medium">
            Your Refund Policy has been successfully updated and will now appear
            in the app.
          </p>
        </div>
      )}

      {/* Single Card with everything in one column */}
      <Card className="p-0">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Write or paste your Refund Policy here...
            </p>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <JoditEditor
                value={content}
                config={config}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                Last Updated On : {lastUpdated}
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="py-4 lg:py-6 lg:px-4! gap-1 text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Refund Policy"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundPolicyPage;
