"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Scan } from "lucide-react";
import QRCode from "qrcode";

const QRScannerModal = ({
  lostItemId,
  onMobileUploadComplete,
}: {
  lostItemId?: string;
  onMobileUploadComplete?: () => void;
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (isQRModalOpen) {
      generateQRCode();
    }
  }, [isQRModalOpen, lostItemId]);

  useEffect(() => {
    if (onMobileUploadComplete && isQRModalOpen) {
      setIsQRModalOpen(false);
    }
  }, [onMobileUploadComplete, isQRModalOpen]);

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
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

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

          <div className="space-y-6 py-4">
            <p className="text-sm text-[#7C8493] text-center">
              Scan the following QR from a device with a camera to take a photo
              of the item
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
                  <div className="w-48 h-48 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      Generating QR...
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-500">Scan to open camera</p>
              </div>
            </div>
          </div>

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
