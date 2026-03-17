"use client";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState, useRef } from "react";

export default function WhatsAppButton() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolling state to true
      setIsScrolling(true);

      // Close tooltip immediately when scrolling starts
      setIsTooltipOpen(false);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a timeout to mark scrolling as ended after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust this value for sensitivity (150ms after scroll stops)
    };

    // Show tooltip after 3 seconds only if not scrolling
    const showTooltipTimer = setTimeout(() => {
      if (!isScrolling) {
        setIsTooltipOpen(true);

        // Auto-hide after 5 seconds
        const hideTimer = setTimeout(() => {
          setIsTooltipOpen(false);
        }, 5000);

        return () => clearTimeout(hideTimer);
      }
    }, 2000);

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(showTooltipTimer);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolling]);

  // Handle mouse enter - only open if not scrolling
  const handleMouseEnter = () => {
    if (!isScrolling) {
      setIsTooltipOpen(true);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsTooltipOpen(false);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed bottom-6 right-6 z-50">
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <a
              href="https://wa.me/447883156028"
              target="_blank"
              rel="noopener noreferrer"
              className="
                block
                animate-float
                hover:scale-110 hover:rotate-6
                transition-transform duration-500
              "
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={require("@/lib/icons/whatsapp.png")}
                alt="WhatsApp Icon"
                width={200}
                height={200}
                className="
                  w-14 h-14
                  animate-pulse          
                  drop-shadow-lg
                  cursor-pointer
                "
              />
            </a>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="text-2xl bg-primary text-primary-foreground px-4 py-2"
          >
            <p className="font-medium">Need Help?</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
