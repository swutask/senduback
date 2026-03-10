"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import FAQHero from "./faq-hero";

export const faqData = [
  {
    section: "General Questions",
    items: [
      {
        id: "1.1",
        question: "I forgot something. How do I get it back using SendUBack?",
        answer:
          "If you forgot an item at a hotel, airport, Airbnb, hospital, event venue, or other location, SendUBack helps you recover and return it. You can create a request on SendUBack, provide item and delivery details, and we will coordinate with the location. Once the item is found and confirmed, SendUBack manages the return and delivers the item to your chosen address.",
      },
      {
        id: "1.2",
        question: "Who can use SendUBack?",
        answer:
          "SendUBack is available for guests and travellers, hotels and resorts, airports and airlines, Airbnb and short-stay hosts, car rental companies, hospitals, event venues, museums, and transport providers.",
      },
      {
        id: "1.3",
        question: "Is SendUBack available internationally?",
        answer:
          "Yes. SendUBack supports both domestic and international returns, including worldwide shipping, subject to local regulations and item restrictions.",
      },
      {
        id: "1.4",
        question: "How much does it cost to return my item?",
        answer:
          "The cost depends on pickup location, delivery destination, item size and weight, delivery speed, and optional insurance. The full price is shown clearly before payment.",
      },
      {
        id: "1.5",
        question: "Who do I contact if I need help?",
        answer:
          "You always contact SendUBack directly via email, phone, WhatsApp, or the website contact form.",
      },
    ],
  },
  {
    section: "Orders & Item Recovery",
    items: [
      {
        id: "2.1",
        question: "Do you help find lost items?",
        answer:
          "Yes. SendUBack helps by coordinating with the hotel, airport, or business where the item was left. The item must be located and confirmed before shipping begins.",
      },
      {
        id: "2.2",
        question: "Can I create an order if my item is not yet found?",
        answer:
          "Yes. You can create an order even if the item is not yet confirmed. The order remains on hold until the item is found and released.",
      },
    ],
  },
  {
    section: "Shipping & Item Restrictions",
    items: [
      {
        id: "3.1",
        question: "What items can SendUBack ship?",
        answer:
          "Most personal items such as clothing, electronics, documents, luggage, and personal belongings, subject to regulations.",
      },
      {
        id: "3.2",
        question: "What items are NOT allowed to be shipped?",
        answer:
          "Restricted items include cash, bank cards, dangerous goods, weapons, illegal substances, certain liquids, medicines, and perishable food.",
      },
      {
        id: "3.3",
        question: "Can you ship passports or IDs?",
        answer:
          "Yes. Passports and IDs can be shipped, subject to courier and country regulations.",
      },
    ],
  },
  {
    section: "Customs, Delays & Delivery Issues",
    items: [
      {
        id: "4.1",
        question: "Will I need to pay customs duty or tax?",
        answer:
          "Yes, if applicable. Customs duties and taxes are the responsibility of the receiver and are not included in the shipping price.",
      },
    ],
  },
  {
    section: "Payments & Refunds",
    items: [
      {
        id: "5.1",
        question: "Who pays for the shipment?",
        answer:
          "The guest pays all shipping costs. Hotels and businesses do not pay.",
      },
    ],
  },
  {
    section: "Liability & Privacy",
    items: [
      {
        id: "6.1",
        question: "Are hotels responsible if something goes wrong?",
        answer:
          "No. Once the item is handed to SendUBack, the hotel has no liability.",
      },
      {
        id: "6.2",
        question: "How is my personal data used?",
        answer:
          "Data is used only to process orders and support customers. Full details are in the Privacy Policy.",
      },
    ],
  },
];

export default function FAQSection() {
  const pathname = usePathname();

  // const { data } = useGetFAQQuery(undefined);
  // console.log("FAQ", data);

  // console.log(pathname);

  const displayedData =
    pathname === "/"
      ? faqData.filter((section) => section.section === "General Questions")
      : faqData;

  return (
    <>
      {pathname !== "/" && <FAQHero />}

      <div className="flex items-center py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden flex flex-col lg:flex-row justify-between gap-10">
          {pathname !== "/faq" && (
            <div className="">
              <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 md:mb-10">
                Frequently asked questions
              </h1>
              <div className="w-24 h-3 relative py-5">
                <div className="w-16 h-3 left-6 top-0 absolute bg-linear-to-br from-sky-500 via-sky-600 to-sky-100 rounded-2xl" />
                <div className="w-3 h-3 left-0 top-0 absolute bg-linear-to-br from-sky-500 via-sky-600 to-sky-100 rounded-full" />
              </div>
              {pathname === "/faq" ? (
                ""
              ) : (
                <Link href={"/faq"}>
                  <Button
                    className="flex items-center gap-4 text-white px-10! py-6 md:py-8 rounded-2xl bg-linear-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in"
                    variant={"ghost"}
                    style={{
                      boxShadow: "0px 40px 70px rgba(0, 150, 255, 0.2)",
                    }}
                  >
                    Visit FAQ center
                    <ArrowRight className="size-8" />
                  </Button>
                </Link>
              )}
            </div>
          )}
          {/* <div className="flex-1 ">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {data?.map((item: TfAQ) => (
                  <AccordionItem
                    key={item?._id}
                    value={item?._id}
                    className="w-full bg-white border-none md:w-2xl  lg:w-4xl mx-auto !border  rounded-2xl px-3 md:px-6 py-0 md:py-4 transition duration-700"
                  >
                    <AccordionTrigger className="text-xl md:text-xl font-semibold  hover:no-underline py-4 ">
                      {item?.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-lg">
                      {item?.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div> */}

          <Accordion type="single" collapsible className="space-y-4">
            {displayedData?.map((section, sectionIndex) => (
              <div key={section.section}>
                {/* Section Title */}
                <h2 className="text-2xl font-bold my-6">
                  {sectionIndex + 1}. {section.section}
                </h2>

                <div className="space-y-4">
                  {section?.items?.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="w-full bg-white border-none md:w-2xl  lg:w-4xl mx-auto !border  rounded-2xl px-3 md:px-6 py-0 md:py-4 transition duration-700"
                    >
                      <AccordionTrigger className="text-xl md:text-xl font-semibold  hover:no-underline py-4 ">
                        {item?.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-lg">
                        {item?.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
