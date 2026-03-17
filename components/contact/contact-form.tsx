"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { Loader, MessageCircle, ChevronRight } from "lucide-react";

import { useCreateContactMutation } from "@/redux/features/public/publicApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ICONS } from "@/assets";
import Image from "next/image";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone: string;
};

const otherWays = [
  {
    icon: ICONS["CallUs"],
    label: "Call Us",
    value: "+44 151 404 9969",
    sub: "Available Mon-Fri, 9am-6pm GMT",
    href: "tel:+441514049969",
    chevron: true,
    highlight: false,
    hours: null,
  },
  {
    icon: ICONS["EmailUs"],
    label: "Email Us",
    value: "support@senduback.com",
    sub: "We'll respond within 1-2 hours",
    href: "mailto:support@senduback.com",
    chevron: true,
    highlight: false,
    hours: null,
  },
  {
    icon: ICONS["WhatsappUs"],
    label: "WhatsApp",
    value: "+44 7883 156028",
    sub: "Chat with us instantly",
    href: "https://wa.me/447883156028",
    chevron: true,
    highlight: false,
    hours: null,
  },
  {
    icon: ICONS["OfficeAddress"],
    label: "Office Address",
    value: "123 Lost & Found Street",
    sub: "London, EC1A 1BB\nUnited Kingdom",
    href: null,
    chevron: false,
    highlight: true,
    hours: null,
  },
  {
    icon: ICONS["BuisnessHours"],
    label: "Business Hours",
    value: null,
    sub: null,
    href: null,
    chevron: false,
    highlight: true,
    hours: [
      { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
      { day: "Saturday", time: "10:00 AM - 4:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
  },
];

const subjects = [
  "General Enquiry",
  "Lost Item",
  "Shipping Issue",
  "Billing",
  "Other",
];

const inputStyles = cn(
  "w-full rounded-xl border h-[60px]",
  "border-border-input bg-white",
  "text-text-input placeholder:text-text-placeholder",
  "focus-visible:ring-1 focus-visible:ring-blue-deep focus-visible:border-blue-deep",
  "shadow-none",
);

const labelStyles = "text-sm font-medium text-text-muted";

const errorStyles = "text-xs text-red-500";

type OtherWayItem = (typeof otherWays)[number];

function OtherWayCard({ item }: { item: OtherWayItem }) {
  const cardCn = cn(
    "flex items-start gap-4 rounded-2xl border transition-all",
    "px-[25px] py-6 min-h-[128px]",
    item.highlight
      ? "bg-gradient-to-br from-blue-lightest to-white border-border-soft-blue"
      : "bg-white border-border-input hover:border-border-soft-blue hover:shadow-sm cursor-pointer",
  );

  const content = (
    <>
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-blue-deep to-blue-medium shrink-0">
        <Image src={item.icon} alt={item.label} width={48} height={48} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-semibold text-primary-new">
          {item.label}
        </p>

        {item.value && (
          <p className="text-lg font-bold text-text-strong mt-0.5">
            {item.value}
          </p>
        )}

        {item.sub && (
          <p className="text-sm text-text-body mt-0.5 whitespace-pre-line">
            {item.sub}
          </p>
        )}

        {item.hours && (
          <div className="mt-1 space-y-1">
            {item.hours.map((h) => (
              <div key={h.day} className="flex justify-between text-xs">
                <span className="text-text-body">{h.day}</span>
                <span
                  className={cn(
                    "font-medium",
                    h.time === "Closed"
                      ? "text-text-placeholder"
                      : "text-text-muted",
                  )}
                >
                  {h.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {item.chevron && (
        <ChevronRight className="w-4 h-4 text-text-placeholder shrink-0 mt-1" />
      )}
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} target="_blank" className={cardCn}>
        {content}
      </Link>
    );
  }

  return <div className={cardCn}>{content}</div>;
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: { subject: "General Enquiry" },
  });

  const [createContact, { isLoading }] = useCreateContactMutation();

  const onSubmit = async (data: ContactFormValues) => {
    const payload = {
      name: data.name,
      email: data.email,
      message: data.message,
      Phone: data.phone,
    };

    try {
      const res = await createContact({ data: payload });

      if ("data" in res && res.data?.success) {
        toast.success(res.data.message || "Contact submitted successfully");
        reset({ subject: "General Enquiry" });
      }

      if ("error" in res) {
        const errorMessage =
          (res.error as any)?.data?.message || "Something went wrong";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div
      className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-20 pb-10"
      id="contact-form"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div
          className={cn(
            "w-full lg:w-[651.5px] shrink-0 p-7",
            "bg-white rounded-2xl border border-border-soft-blue",
            "flex flex-col gap-8",
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-blue-deep to-blue-medium shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-deep">
                Send us a message
              </h2>
              <p className="text-sm text-text-subtle">
                We'll get back to you shortly
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <Label className={labelStyles}>Your Name</Label>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="John Smith"
                className={inputStyles}
              />
              {errors.name && (
                <p className={errorStyles}>{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelStyles}>Email Address</Label>
              <Input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="john@example.com"
                className={inputStyles}
              />
              {errors.email && (
                <p className={errorStyles}>{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelStyles}>Phone</Label>
              <Input
                type="tel"
                {...register("phone")}
                placeholder="+44 20 1234 5678"
                className={inputStyles}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelStyles}>Subject</Label>
              <div className="relative">
                <select
                  {...register("subject")}
                  className={cn(
                    inputStyles,
                    "appearance-none px-3 py-2 text-sm text-text-muted cursor-pointer",
                  )}
                >
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-text-subtle pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelStyles}>Message</Label>
              <Textarea
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                })}
                placeholder="Tell us how we can help..."
                className={cn(inputStyles, "min-h-[140px] resize-none")}
              />
              {errors.message && (
                <p className={errorStyles}>{errors.message.message}</p>
              )}
            </div>

            <div className="flex flex-col items-stretch gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-6 rounded-xl",
                  "text-white font-semibold text-base",
                  "bg-gradient-to-b from-blue-deep to-blue-medium",
                  "hover:from-blue-mid hover:to-blue-deep",
                  "transition-all flex items-center justify-center gap-2",
                )}
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Image
                      src={ICONS["ContactSubmit"]}
                      alt="card_icon"
                      width={20}
                      height={20}
                    />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-text-placeholder">
                We typically respond within 1-2 hours during business hours (9am
                - 6pm GMT)
              </p>
            </div>
          </form>
        </div>

        <div className="w-full flex flex-col gap-4" id="reach-out">
          <h3 className="text-xl font-bold text-blue-deep">
            Other ways to reach us
          </h3>

          <div className="flex flex-col gap-3">
            {otherWays.map((item) => (
              <OtherWayCard key={item.label} item={item} />
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {[
              {
                href: "https://www.linkedin.com/company/senduback",
                icon: ICONS["ContactLinkedIn"],
              },
              {
                href: "#",
                icon: ICONS["ContactTwitter"],
              },
              {
                href: "https://www.instagram.com/sendubackltd",
                icon: ICONS["ContactInsta"],
              },
            ].map(({ href, icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className={cn(
                  "w-10 h-10 rounded-xl",
                  "flex items-center justify-center",
                  "text-text-muted transition-colors",
                  "hover:border-blue-mid hover:text-blue-deep",
                )}
              >
                <Image src={icon} alt="card_icon" width={50} height={50} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
