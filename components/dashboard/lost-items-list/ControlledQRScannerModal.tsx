"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "qrcode";

interface ControlledQRScannerModalProps {
  lostItemId: string;
  isOpen: boolean;
  onClose: () => void;
  onMobileUploadComplete?: () => void;
}

const ControlledQRScannerModal = ({
  lostItemId,
  isOpen,
  onClose,
  onMobileUploadComplete,
}: ControlledQRScannerModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, lostItemId]);

  const generateQRCode = async () => {
    try {
      // Use your actual URL
      const baseURL =
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
      const url = `${baseURL}/upload/${lostItemId}`;

      const qrImageUrl = await QRCode.toDataURL(url, {
        width: 192,
        margin: 2,
        color: {
          dark: "#3A3A3A",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrImageUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#3A3A3A]">
            Scan QR for Upload
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-[#7C8493] text-center">
            Scan this QR code with a mobile device to upload photos
          </p>

          <div className="flex items-center justify-center p-4">
            <div className="text-center">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto mb-3"
                />
              ) : (
                <div className="w-48 h-48 mx-auto mb-3 flex items-center justify-center border border-gray-200 rounded">
                  <span className="text-gray-400 text-sm">
                    Generating QR...
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500">Scan with mobile camera</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-8 rounded"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ControlledQRScannerModal;
