"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Scan, MapPin } from "lucide-react";
import Image from "next/image";
import QRScannerModal from "./QRScannerModal";

interface AddLostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddLostItemModal = ({
  isOpen,
  onClose,
  onSave,
}: AddLostItemModalProps) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    date: "",
    foundLocation: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestReservationName: "",
    guestRoomNumber: "",
    checkoutDate: "",
    note: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
    setFormData({
      itemName: "",
      itemDescription: "",
      date: "",
      foundLocation: "",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestReservationName: "",
      guestRoomNumber: "",
      checkoutDate: "",
      note: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl! w-full max-h-[90vh] overflow-y-auto    
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-[#0096FF]
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:hover:bg-blue-600
    scrollbar-width: thin
    scrollbar-color: #0096FF #f1f1f1"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#3A3A3A]"></DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add an Image</Label>
            <div className="border border-dashed border-[#3A3A3A] rounded-[12px] p-5 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <div className="space-y-6">
                <p className="text-sm text-[#3A3A3A]">
                  Drag & drop Or <span className="text-[#0096ff]">Browse</span>{" "}
                  Photos (up to 3)
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    src="/dashboard/business/upload2.svg"
                    alt="Upload Picture"
                    width={52}
                    height={52}
                  ></Image>
                </div>
                {/* <div className="flex items-center justify-center">
                                    <Button className="sm:flex-none bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded">
                                        <Scan className="h-4 w-4 mr-2" />
                                        Scan QR
                                    </Button>
                                </div> */}
                <QRScannerModal />
              </div>
            </div>
          </div>

          {/* Item Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#3A3A3A]">Item Details</h3>

            <div className="space-y-2">
              <Label htmlFor="itemName">Item name</Label>
              <Input
                id="itemName"
                placeholder="Enter item name"
                value={formData.itemName}
                onChange={(e) => handleInputChange("itemName", e.target.value)}
                className="bg-[#E6EAEF] p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemDescription">Item Description</Label>
              <Textarea
                id="itemDescription"
                placeholder="Describe the item"
                value={formData.itemDescription}
                onChange={(e) =>
                  handleInputChange("itemDescription", e.target.value)
                }
                className="bg-[#E6EAEF] p-6 min-h-[100px] resize-vertical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="bg-[#E6EAEF] p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundLocation">Where did you find it?</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#0096FF]" />
                <Input
                  id="foundLocation"
                  placeholder="Enter location where item was found"
                  value={formData.foundLocation}
                  onChange={(e) =>
                    handleInputChange("foundLocation", e.target.value)
                  }
                  className="bg-[#E6EAEF] p-6 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Guest Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#3A3A3A]">
              Guest details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="guestName">Guest name</Label>
              <Input
                id="guestName"
                placeholder="Enter guest name"
                value={formData.guestName}
                onChange={(e) => handleInputChange("guestName", e.target.value)}
                className="bg-[#E6EAEF] p-6"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Guest email</Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="Enter guest email"
                  value={formData.guestEmail}
                  onChange={(e) =>
                    handleInputChange("guestEmail", e.target.value)
                  }
                  className="bg-[#E6EAEF] p-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Guest phone</Label>
                <Input
                  id="guestPhone"
                  placeholder="Enter guest phone number"
                  value={formData.guestPhone}
                  onChange={(e) =>
                    handleInputChange("guestPhone", e.target.value)
                  }
                  className="bg-[#E6EAEF] p-6"
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
                  placeholder="Enter reservation name"
                  value={formData.guestReservationName}
                  onChange={(e) =>
                    handleInputChange("guestReservationName", e.target.value)
                  }
                  className="bg-[#E6EAEF] p-6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestRoomNumber">Guest room number</Label>
                <Input
                  id="guestRoomNumber"
                  placeholder="Enter room number"
                  value={formData.guestRoomNumber}
                  onChange={(e) =>
                    handleInputChange("guestRoomNumber", e.target.value)
                  }
                  className="bg-[#E6EAEF] p-6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkoutDate">Checkout date</Label>
              <Input
                id="checkoutDate"
                type="date"
                value={formData.checkoutDate}
                onChange={(e) =>
                  handleInputChange("checkoutDate", e.target.value)
                }
                className="bg-[#E6EAEF] p-6"
              />
            </div>
          </div>

          {/* Note Section */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any additional notes..."
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              className="bg-[#E6EAEF] p-6 min-h-[100px] resize-vertical"
            />
          </div>
        </div>

        <DialogFooter>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors py-2 px-6 rounded"
            >
              Close
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 sm:flex-none bg-[#0096FF] text-white hover:bg-blue-600 transition-colors py-2 px-6 rounded"
            >
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLostItemModal;
