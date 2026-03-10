"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InfoIcon, PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SendCustomerLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
  defaultEmail?: string;
}

export function SendCustomerLinkModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  defaultEmail = "",
}: SendCustomerLinkModalProps) {
  const [email, setEmail] = useState(defaultEmail);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  const handleSubmit = () => {
    if (!email.trim()) {
      alert("Please enter a valid email address");
      return;
    }
    onSubmit(email);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl">Send Customer Link</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter guest email"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                />
                <PencilIcon
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"
                />
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon size={16} className="text-blue-600" />
              <AlertDescription className="text-blue-800 ml-2">
                An email will be sent to the guest with a link to claim their
                lost item.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Link"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
