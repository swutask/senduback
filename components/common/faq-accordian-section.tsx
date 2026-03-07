"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ICONS } from "@/assets";
import { ChevronUpIcon } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general",
    title: "General Questions",
    items: [
      {
        id: "g1",
        question: "What is SendUBack?",
        answer:
          "A: SendUBack is a lost and found shipping platform that helps guests easily arrange delivery for items they have forgotten. Guests can book shipments through a secure link, while hotels and hospitality businesses use the SendUBack dashboard to manage lost items, send payment links, and organise delivery. The platform can be used by hotels, Airbnb hosts, serviced apartments, and other hospitality businesses to manage lost property in one simple, professional system.",
      },
      {
        id: "g2",
        question: "How does SendUBack work?",
        answer:
          "Hotels and hospitality businesses register lost items in the SendUBack dashboard. Guests then receive a secure link where they can choose delivery options and complete payment. Once confirmed, SendUBack arranges shipping and tracking until the item is delivered. Guests can easily book shipments for lost items from anywhere to anywhere through the platform.",
      },
      {
        id: "g3",
        question: "Who can use SendUBack?",
        answer:
          "SendUBack is designed for hotels, Airbnb hosts, serviced apartments, property managers, and guests who have forgotten items.",
      },
      {
        id: "g4",
        question: "Which countries do you ship to?",
        answer:
          "SendUBack supports both domestic and international shipping depending on courier availability.",
      },
      {
        id: "g5",
        question: "What types of items can be returned?",
        answer:
          "Most personal belongings such as clothes, electronics, chargers, documents, and accessories can be shipped (subject to courier restrictions).",
      },
    ],
  },
  {
    id: "hotels",
    title: "For Hotels & Property Managers — Setup & Onboarding",
    items: [
      {
        id: "h1",
        question: "Is SendUBack free for hotels?",
        answer:
          "Yes. Hotels can use SendUBack completely free. Guests pay shipping costs directly.",
      },
      {
        id: "h2",
        question: "How long does it take to start?",
        answer:
          "Setup takes less than one minute. Hotels can begin managing lost items immediately.",
      },
      {
        id: "h3",
        question: "Do staff need training?",
        answer:
          "No. The dashboard is designed to be simple and easy for hotel teams.",
      },
    ],
  },
  {
    id: "liability",
    title: "For Hotels & Property Managers — Liability & Responsibility",
    items: [
      {
        id: "l1",
        question: "Are hotels responsible for shipping problems?",
        answer:
          "No. Once the item is handed to SendUBack, shipping responsibility transfers to SendUBack.",
      },
      {
        id: "l2",
        question: "Who handles shipping claims or issues?",
        answer: "SendUBack manages all shipping support and claims directly.",
      },
      {
        id: "l3",
        question: "Is there proof when the hotel hands over the item?",
        answer:
          "Yes. Tracking and shipment confirmation provide proof of handover.",
      },
    ],
  },
  {
    id: "hotel_workflow",
    title: "For Hotels & Property Managers — Dashboard & Workflow",
    items: [
      {
        id: "w1",
        question: "How do staff add lost items?",
        answer:
          "Staff create a new entry in the dashboard with item details and optional photos.",
      },
      {
        id: "w2",
        question: "What happens after the guest pays?",
        answer:
          "The item moves into shipment status where the shipping label becomes available.",
      },
      {
        id: "w3",
        question: "How do hotels download shipping labels?",
        answer: "Labels appear in the Shipment section once generated.",
      },
      {
        id: "w4",
        question: "What do item statuses mean?",
        answer: "Lost → Collected → Shipment → Delivered.",
      },
    ],
  },
  {
    id: "operations",
    title: "For Hotels & Property Managers — Operations & Multi-Property",
    items: [
      {
        id: "o1",
        question: "Can multiple staff members use the dashboard?",
        answer: "Yes, multiple users can manage lost items.",
      },
      {
        id: "o2",
        question: "Can hotel groups manage multiple properties?",
        answer: "Yes. SendUBack supports multi-property management.",
      },
      {
        id: "o3",
        question: "How does SendUBack save staff time?",
        answer:
          "It automates communication, payment collection, and shipping, reducing manual work.",
      },
    ],
  },
  {
    id: "property",
    title: "For Hotels & Property Managers — Why Hotels Use SendUBack",
    items: [
      {
        id: "p1",
        question: "Why not ship items manually?",
        answer:
          "Manual returns are time-consuming and create liability risk. SendUBack automates the process professionally.",
      },
      {
        id: "p2",
        question: "How does SendUBack improve guest satisfaction?",
        answer: "Guests receive a fast, trackable, and easy return experience.",
      },
    ],
  },
  {
    id: "getting_started",
    title: "For Guests — Getting Started",
    items: [
      {
        id: "gs1",
        question: "How do I request my lost item?",
        answer:
          "Guests can request their lost item in two ways: either by booking the shipment directly on the SendUBack website or by using the secure link sent by the hotel. The process is simple and takes less than a minute to complete.",
      },
      {
        id: "gs2",
        question: "What information do I need?",
        answer:
          "Your delivery address, contact details, and shipping selection.",
      },
    ],
  },
  {
    id: "shipping",
    title: "For Guests — Shipping & Delivery",
    items: [
      {
        id: "sh1",
        question: "How long does shipping take?",
        answer:
          "Delivery time depends on destination and shipping option selected.",
      },
      {
        id: "sh2",
        question: "Can I choose express delivery?",
        answer: "Yes. Standard and express options are available.",
      },
      {
        id: "sh3",
        question: "Can I track my shipment?",
        answer: "Yes. Tracking details are provided after dispatch.",
      },
      {
        id: "sh4",
        question: "Do you ship internationally?",
        answer:
          "Yes, international shipping is available for most destinations.",
      },
    ],
  },
  {
    id: "payments",
    title: "For Guests — Payments",
    items: [
      {
        id: "py1",
        question: "Who pays for shipping?",
        answer: "Guests pay the shipping cost at checkout.",
      },
      {
        id: "py2",
        question: "Are there hidden charges?",
        answer: "No. All pricing is shown before payment.",
      },
      {
        id: "py3",
        question: "Which payment methods are accepted?",
        answer: "Secure online payment options are available via stripe.",
      },
    ],
  },
  {
    id: "protection",
    title: "For Guests — Item Protection",
    items: [
      {
        id: "ps1",
        question: "Is my item protected during shipping?",
        answer: "Yes. Shipments include tracking and protection.",
      },
      {
        id: "ps2",
        question: "What happens if my item is damaged?",
        answer: "Claims are handled directly through SendUBack support.",
      },
      {
        id: "ps3",
        question: "What if I entered the wrong address?",
        answer: "Contact support immediately before dispatch.",
      },
    ],
  },
  {
    id: "policy",
    title: "Shipping, Protection & Policies",
    items: [
      {
        id: "pl1",
        question: "Which couriers do you use?",
        answer:
          "SendUBack works with trusted domestic and international courier partners.",
      },
      {
        id: "pl2",
        question: "Are all shipments tracked?",
        answer: "Yes. Every shipment includes tracking.",
      },
      {
        id: "pl3",
        question: "Are some items restricted?",
        answer: "Yes. Items must comply with courier shipping rules.",
      },
      {
        id: "pl4",
        question: "How is shipping price calculated?",
        answer:
          "Pricing depends on destination, package size, and shipping speed.",
      },
      {
        id: "pl5",
        question: "What happens if my item is not insured?",
        answer:
          " If a shipment is not insured, SendUBack will not be able to refund the item’s declared value in case of loss or damage. For this reason, we strongly encourage all customers to fully insure their items when booking shipment.",
      },
    ],
  },
  {
    id: "data",
    title: "Security & Data Protection",
    items: [
      {
        id: "d1",
        question: "Is SendUBack secure?",
        answer: "Yes. Payments and data are handled using secure systems.",
      },
      {
        id: "d2",
        question: "How do you protect personal information?",
        answer: "We follow strict data security and protection practices.",
      },
      {
        id: "d3",
        question: "How do you prevent disputes?",
        answer:
          "Tracking, proof of handover, and transparent processes reduce disputes.",
      },
    ],
  },
  {
    id: "support",
    title: "Support & Help",
    items: [
      {
        id: "su1",
        question: "How can I contact support?",
        answer:
          "Support is available through the Help section on the platform. You can also contact us by email at support@senduback.com, call us directly, or reach us via WhatsApp for assistance.",
      },
      {
        id: "su2",
        question: "When is support available?",
        answer: "Operating hours are listed inside the help section.",
      },
      {
        id: "su3",
        question: "How do you prevent disputes?",
        answer:
          "Tracking, proof of handover, and transparent processes reduce disputes.",
      },
    ],
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function FAQAccordionItem({ item }: { item: FAQItem }) {
  return (
    <Accordion.Item
      value={item.id}
      className={cn(
        "rounded-[.8rem] border border-[#E5E9F0] bg-white overflow-hidden",
        "transition-shadow duration-200 ease-out",
        "data-[state=open]:shadow-[0_2px_18px_rgba(0,0,128,0.08)]",
        "data-[state=open]:border-[#C8D9F5]",
      )}
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger
          className={cn(
            "group flex w-full items-center justify-between",
            "px-6 py-5 text-left",
            "cursor-pointer select-none",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-blue-400 focus-visible:ring-inset",
          )}
        >
          <span className="font-medium text-[#0F172A] text-[0.95rem] leading-snug pr-6 max-md:text-[1rem]">
            {item.question}
          </span>

          <ChevronUpIcon
            className={cn(
              "w-5 h-5 shrink-0 text-[#9CA3C5]",
              "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-data-[state=closed]:rotate-180",
            )}
          />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content
        className={cn(
          "overflow-hidden",
          "data-[state=open]:animate-[accordionDown_0.3s_cubic-bezier(0.22,1,0.36,1)]",
          "data-[state=closed]:animate-[accordionUp_0.25s_cubic-bezier(0.22,1,0.36,1)]",
        )}
      >
        <p className="px-6 pb-6 text-[#0F172A] text-[0.875rem] leading-relaxed max-md:text-[0.825rem]">
          {item.answer}
        </p>
      </Accordion.Content>
    </Accordion.Item>
  );
}

function FAQCategoryBlock({ category }: { category: FAQCategory }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              "text-accent",
            )}
          >
            <Image
              src={ICONS[`faq_${category.id}`]}
              alt={category.id}
              width={50}
              height={50}
            />
          </div>

          <h2 className="font-bold text-[#0D1B6E] leading-tight text-[2rem] max-md:text-[1.15rem]">
            {category.title}
          </h2>
        </div>

        <div className="ml-12 w-10 h-[3px] rounded-full bg-blue-600" />
      </div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerVariants}
        className="flex flex-col gap-3"
      >
        <Accordion.Root type="multiple" className="flex flex-col gap-3">
          {category.items.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <FAQAccordionItem item={item} />
            </motion.div>
          ))}
        </Accordion.Root>
      </motion.div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <>
      <section
        className={cn(
          "w-full bg-white flex justify-center",
          "px-[135px] py-20",
          "max-md:px-4 max-md:py-12",
        )}
      >
        <div
          className={cn(
            "w-full flex flex-col",
            "max-w-[1169px] gap-[52px]",
            "max-md:gap-10",
          )}
        >
          {FAQ_CATEGORIES.map((category) => (
            <FAQCategoryBlock key={category.id} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
