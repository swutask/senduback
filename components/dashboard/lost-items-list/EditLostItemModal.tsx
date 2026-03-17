"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface EditLostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: any;
  onSave: (id: string, data: any) => Promise<void>;
}

export default function EditLostItemModal({
  isOpen,
  onClose,
  itemData,
  onSave,
}: EditLostItemModalProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    dateFound: "",
    locationFound: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestReservationName: "",
    guestRoomNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with itemData when modal opens
  useEffect(() => {
    if (itemData && isOpen) {
      setFormData({
        itemName: itemData.itemName || "",
        itemDescription: itemData.itemDescription || "",
        dateFound: itemData.dateFound
          ? new Date(itemData.dateFound).toISOString().split("T")[0]
          : "",
        locationFound: itemData.locationFound || "",
        guestName: itemData.guestName || "",
        guestEmail: itemData.guestEmail || "",
        guestPhone: itemData.guestPhone || "",
        guestReservationName: itemData.guestReservationName || "",
        guestRoomNumber: itemData.guestRoomNumber || "",
      });
    }
  }, [itemData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format date to ISO string
      const formattedData = {
        ...formData,
        dateFound: formData.dateFound
          ? new Date(formData.dateFound).toISOString()
          : null,
      };

      await onSave(itemData._id, formattedData);
      toast.success("Lost item updated successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update lost item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#25324B]">
            Edit Lost Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Item Details */}
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name *</Label>
            <Input
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemDescription">Description</Label>
            <Textarea
              id="itemDescription"
              name="itemDescription"
              value={formData.itemDescription}
              onChange={handleChange}
              placeholder="Enter item description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFound">Date Found *</Label>
              <Input
                id="dateFound"
                name="dateFound"
                type="date"
                value={formData.dateFound}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationFound">Location Found *</Label>
              <Input
                id="locationFound"
                name="locationFound"
                value={formData.locationFound}
                onChange={handleChange}
                placeholder="Where was it found?"
                required
              />
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name</Label>
            <Input
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              placeholder="Guest's full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Guest Email</Label>
              <Input
                id="guestEmail"
                name="guestEmail"
                type="email"
                value={formData.guestEmail}
                onChange={handleChange}
                placeholder="guest@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone">Guest Phone</Label>
              <Input
                id="guestPhone"
                name="guestPhone"
                value={formData.guestPhone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestReservationName">Reservation Name</Label>
              <Input
                id="guestReservationName"
                name="guestReservationName"
                value={formData.guestReservationName}
                onChange={handleChange}
                placeholder="Reservation name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestRoomNumber">Room Number</Label>
              <Input
                id="guestRoomNumber"
                name="guestRoomNumber"
                value={formData.guestRoomNumber}
                onChange={handleChange}
                placeholder="Room number"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0096FF] hover:bg-blue-600 text-white"
            >
              {isSubmitting ? "Updating..." : "Update Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
