"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Scan } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";

const QRScannerModal = ({
  lostItemId,
  onMobileUploadComplete,
  isInline = false,
}: {
  lostItemId?: string;
  onMobileUploadComplete?: () => void;
  isInline?: boolean;
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(isInline);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (isInline) {
      setIsQRModalOpen(true);
    }
  }, [isInline]);

  useEffect(() => {
    if (isQRModalOpen) {
      generateQRCode();
    }
  }, [isQRModalOpen, lostItemId]);

  useEffect(() => {
    if (onMobileUploadComplete && isQRModalOpen && !isInline) {
      setIsQRModalOpen(false);
    }
  }, [onMobileUploadComplete, isQRModalOpen, isInline]);

  const generateQRCode = async () => {
    try {
      let url;

      if (lostItemId) {
        url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/upload/${lostItemId}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/upload/${lostItemId}`;
      }

      const qrImageUrl = await QRCode.toDataURL(url, {
        width: 192,
        margin: 2,
        color: {
          dark: "#3A3A3A",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrImageUrl);
      setUrl(url);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  const QRContent = () => (
    <div className="space-y-6 py-4">
      {!isInline && (
        <p className="text-sm text-[#7C8493] text-center">
          Scan the following QR from a device with a camera to take a photo of
          the item
        </p>
      )}

      <div className="flex items-center justify-center p-4">
        <div className="text-center w-full max-w-sm">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48 mx-auto mb-3"
            />
          ) : (
            <div className="w-48 h-48 mx-auto mb-3 flex items-center justify-center border border-gray-100 rounded bg-gray-50">
              <span className="text-gray-400 text-sm">Generating QR...</span>
            </div>
          )}
          <p className="text-xs text-gray-500 mb-4 font-medium">
            Scan to open camera
          </p>

          {url && (
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider text-left">
                Upload Link
              </p>
              <div className="flex items-center gap-2 group">
                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-blue-600 font-mono truncate text-left">
                  {url}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm shrink-0 border-gray-200"
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return <QRContent />;
  }

  return (
    <>
      {/* Scan QR Button */}
      <div className="flex items-center justify-center">
        <Button
          className="sm:flex-none bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded"
          onClick={() => setIsQRModalOpen(true)}
        >
          <Scan className="h-4 w-4 mr-2" />
          Scan QR
        </Button>
      </div>

      {/* QR Scanner Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#3A3A3A]">
              Scan QR Code
            </DialogTitle>
          </DialogHeader>

          <QRContent />

          <div className="flex justify-center">
            <Button
              onClick={() => setIsQRModalOpen(false)}
              className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-8 rounded"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRScannerModal;
