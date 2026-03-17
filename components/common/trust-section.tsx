"use client";

import { motion, type Variants, AnimatePresence } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faq_general: FAQItem[] = [
  {
    id: "item-1",
    question: "I forgot something. How do I get it back using SendUBack?",
    answer:
      "If you forgot an item at a hotel, airport, Airbnb, hospital, event venue, or other location, SendUBack helps you recover and return it. You can create a request on SendUBack, provide item and delivery details, and we will coordinate with the location. Once the item is found and confirmed, SendUBack manages the return and delivers the item to your chosen address.",
  },
  {
    id: "item-2",
    question: "Who can use SendUBack?",
    answer:
      "SendUBack is available for guests and travellers, hotels and resorts, airports and airlines, Airbnb and short-stay hosts, car rental companies, hospitals, event venues, museums, and transport providers.",
  },
  {
    id: "item-3",
    question: "Is SendUBack available internationally?",
    answer:
      "Yes. SendUBack supports both domestic and international returns, including worldwide shipping, subject to local regulations and item restrictions.",
  },
  {
    id: "item-4",
    question: "How much does it cost to return my item?",
    answer:
      "The cost depends on pickup location, delivery destination, item size and weight, delivery speed, and optional insurance. The full price is shown clearly before payment.",
  },
  {
    id: "item-5",
    question: "Who do I contact if I need help?",
    answer:
      "You always contact SendUBack directly via email, phone, WhatsApp, or the website contact form.",
  },
];

const faq_guest: FAQItem[] = [
  {
    id: "item-1",
    question: "How do I request my lost item?",
    answer:
      "Guests can request their lost item in two ways: either by booking the shipment directly on the SendUBack website or by using the secure link sent by the hotel. The process is simple and takes less than a minute to complete.",
  },
  {
    id: "gs2",
    question: "What information do I need?",
    answer: "Your delivery address, contact details, and shipping selection.",
  },
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
];

const faq_hotel: FAQItem[] = [
  {
    id: "item-1",
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
];

const faqs = {
  guest: faq_guest,
  hotel: faq_hotel,
  general: faq_general,
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line
      x1="9"
      y1="3"
      x2="9"
      y2="15"
      stroke="#1e3a8a"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="3"
      y1="9"
      x2="15"
      y2="9"
      stroke="#1e3a8a"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line
      x1="3"
      y1="9"
      x2="15"
      y2="9"
      stroke="#1e3a8a"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const FAQAccordionItem = ({
  item,
  isOpen,
}: {
  item: FAQItem;
  isOpen: boolean;
}) => (
  <motion.div variants={itemVariants}>
    <Accordion.Item
      value={item.id}
      className={`
        rounded-2xl border transition-colors duration-200
        ${
          isOpen
            ? "border-slate-200 bg-white shadow-sm"
            : "border-slate-200 bg-white hover:border-blue-200"
        }
      `}
    >
      <Accordion.Header asChild>
        <Accordion.Trigger className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group focus:outline-none">
          <span
            className={`text-[16px] md:text-[17px] font-semibold leading-snug transition-colors duration-200 ${
              isOpen ? "text-[#0d1b8e]" : "text-[#0d1b8e]"
            }`}
          >
            {item.question}
          </span>
          <span className="shrink-0 mt-0.5 transition-transform duration-200">
            {isOpen ? <MinusIcon /> : <PlusIcon />}
          </span>
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content forceMount asChild>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: {
                  duration: 0.32,
                  ease: [0.25, 0.46, 0.45, 0.94] as [
                    number,
                    number,
                    number,
                    number,
                  ],
                },
                opacity: { duration: 0.25, ease: "easeOut" },
              }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 text-[15px] text-slate-500 leading-relaxed">
                {item.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Accordion.Content>
    </Accordion.Item>
  </motion.div>
);

export default function TrustSection({
  type = "guest",
}: {
  type?: "guest" | "hotel" | "general";
}) {
  const [openItem, setOpenItem] = useState<string>("item-1");

  return (
    <section className="bg-white w-full">
      <div className="max-w-[1440px] mx-auto px-[135px] max-md:px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col items-center gap-[52px] max-md:gap-8"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <motion.h2
              variants={fadeUpVariants}
              className="text-[30px] md:text-[36px] font-bold text-[#0d1b8e] leading-tight tracking-tight max-w-[600px]"
            >
              Trusted by guests &amp; hotels
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-[16px] text-slate-400 leading-relaxed"
            >
              Real stories from people who got their items back
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            className="w-full max-w-[870px] mx-auto flex flex-col gap-4"
          >
            <Accordion.Root
              type="single"
              value={openItem}
              collapsible
              onValueChange={(val) => setOpenItem(val ?? "")}
              className="flex flex-col gap-4"
            >
              {faqs[type].map((faq) => (
                <FAQAccordionItem
                  key={faq.id}
                  item={faq}
                  isOpen={openItem === faq.id}
                />
              ))}
            </Accordion.Root>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
