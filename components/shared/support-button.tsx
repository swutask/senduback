"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  X,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const supportItems = [
  {
    icon: <MessageCircle className="w-5 h-5 text-white" />,
    iconBg: "bg-green-400",
    label: "WhatsApp",
    sub: "Chat with us instantly",
    href: "https://wa.me/447883156028",
    external: true,
  },
  {
    icon: <Phone className="w-5 h-5 text-white" />,
    iconBg: "bg-blue-400",
    label: "Call Us",
    sub: "Speak to our team",
    href: "tel:+441514049969",
    external: false,
  },
  {
    icon: <Mail className="w-5 h-5 text-white" />,
    iconBg: "bg-violet-500",
    label: "Email",
    sub: "We reply within 1–2 hours",
    href: "mailto:support@senduback.com",
    external: false,
  },
  {
    icon: <ExternalLink className="w-5 h-5 text-white" />,
    iconBg: "bg-[#000080]",
    label: "Contact Page",
    sub: "Send us a detailed message",
    href: "/contact",
    external: false,
  },
];

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="support-panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              originX: 1,
              originY: 1,
              boxShadow:
                "0px 16px 48px rgba(0, 0, 128, 0.14), 0px 4px 12px rgba(0, 0, 128, 0.08)",
            }}
            className="w-[300px] bg-white rounded-2xl overflow-hidden mb-2"
          >
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.2 }}
              className="flex items-start justify-between px-5 pt-5 pb-4"
            >
              <div>
                <p className="text-[15px] font-bold text-[#000080]">
                  How can we help?
                </p>
                <p className="text-[13px] text-slate-400 mt-0.5">
                  Choose a way to reach us
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-slate-500 transition mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>

            <div className="px-3 pb-3 flex flex-col gap-0.5">
              {supportItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.06 + 0.1,
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition group"
                  >
                    <span
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        item.iconBg,
                      )}
                    >
                      {item.icon}
                    </span>
                    <div className="leading-tight">
                      <p className="text-[13.5px] font-semibold text-[#000080] group-hover:text-blue-600 transition">
                        {item.label}
                      </p>
                      <p className="text-[12px] text-slate-400">{item.sub}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.2 }}
              className="px-5 py-3 border-t border-slate-100"
            >
              <p className="text-[11.5px] text-center text-slate-500 font-medium">
                Typically available Mon–Fri, 9am–6pm
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={{ scale: isOpen ? 0.95 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 relative",
          "bg-[linear-gradient(135deg,#0099FF_0%,#000080_100%)]",
          "shadow-[0_8px_24px_rgba(0,0,128,0.35)] drop-shadow-2xl",
        )}
        aria-label="Open support"
      >
        <span className="absolute w-14 h-14 rounded-full bg-blue-400/20" />
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative z-10"
            >
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="headphones"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative z-10"
            >
              <Headphones className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
