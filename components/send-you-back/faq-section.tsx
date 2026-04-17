"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is Send You Back the same as SendUBack?",
    a: "Yes! Send You Back, Send U Back, and SendUBack all refer to the same company — the trusted platform that helps hotels return lost items to their guests quickly and securely",
  },
  {
    q: "How do I use Send U Back to get my lost item returned?",
    a: "Simply visit senduback.com, report your lost item with details about your hotel stay, and our platform will coordinate with the hotel to ship it directly to your door.",
  },
  {
    q: "What hotels work with Send You Back?",
    a: "SendUBack partners with hotels worldwide. If you left something behind at a hotel, visit our website to check if your hotel is part of the Send You Back network.",
  },
  {
    q: "How much does Send U Back cost?",
    a: "SendUBack charges a simple flat fee that covers packaging, shipping, and handling. The exact cost depends on the size and destination. Visit senduback.com for a quote.",
  },
  {
    q: "I left something at a hotel — how do I get my stuff back?",
    a: "If you forgot something at a hotel, SendUBack is the easiest hotel lost and found return service. Simply report your lost item on senduback.com and we'll coordinate with the hotel to send your belongings back to you.",
  },
  {
    q: "Is there a hotel lost and found return service I can use?",
    a: "Yes! SendUBack (also known as Send You Back or Send U Back) is a dedicated hotel lost and found return service. We handle the entire lost item recovery process — from contacting the hotel to shipping your items directly to your door.",
  },
  {
    q: "How long does it take to get my items back?",
    a: "Most items are shipped within 48 hours of your request being confirmed by the hotel. Delivery times vary by destination, but domestic shipments typically arrive in 2–5 business days and international shipments in 5–10 business days.",
  },
  {
    q: "Can I track my lost item shipment?",
    a: "Yes! Every SendUBack shipment includes real-time tracking. You'll receive a tracking number via email as soon as your item is shipped, so you can follow its journey from the hotel to your door.",
  },
  {
    q: "What if the hotel can't find my item?",
    a: "If the hotel is unable to locate your item after a thorough search, we'll notify you immediately. You won't be charged unless your item is found and shipped. SendUBack only charges when a successful return is completed.",
  },
  {
    q: "Do hotels pay for SendUBack?",
    a: "SendUBack is free for hotels to join. The guest pays a simple flat fee that covers packaging, shipping, and handling. Hotels benefit from improved guest satisfaction and reduced lost-and-found management overhead at no cost.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="bg-gray-50/80 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-blue-500">
          Got Questions?
        </p>

        {/* Heading */}
        <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>

        {/* Accordion */}
        <Accordion.Root type="single" collapsible className="space-y-3">
          {faqs.map(({ q, a }, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className={cn(
                "rounded-xl border border-gray-200 bg-white overflow-hidden",
                "data-[state=open]:border-blue-200 transition-colors duration-200",
              )}
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    "group flex w-full items-center justify-between px-6 py-4",
                    "text-left text-sm font-semibold text-gray-800",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-inset",
                  )}
                >
                  {q}
                  <ChevronDown
                    className={cn(
                      "ml-4 h-4 w-4 flex-shrink-0 text-gray-400",
                      "transition-transform duration-200",
                      "group-data-[state=open]:rotate-180 group-data-[state=open]:text-blue-500",
                    )}
                  />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content
                className={cn(
                  "overflow-hidden text-sm text-gray-500 leading-relaxed",
                  "data-[state=open]:animate-accordion-down",
                  "data-[state=closed]:animate-accordion-up",
                )}
              >
                <div className="px-6 pb-5 pt-1">{a}</div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
