"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetRefundPolicyQuery } from "@/redux/features/public/publicApi";

// Define the type for each section to make the code type-safe
interface Section {
  id: number;
  title: string;
  content?: string;
  items?: string[];
}

// Array of all Refund Policy sections
// This makes it easy to add or modify sections
const refundPolicyData: Section[] = [
  {
    id: 1,
    title: "What you're paying for",
    content: "When you place an order, your payment usually covers:",
    items: [
      "Product cost (item price, applicable taxes included)",
      "Shipping costs charged by the courier (e.g., DHL, UPS, FedEx, etc.)",
      "Optional extras (insurance for express delivery, special handling, etc.)",
      "Some parts of this amount may be refundable, others are not (see below)",
    ],
  },
  {
    id: 2,
    title: "Eligibility",
    items: [
      "Job Seekers must be at least 16 years old",
      "Employers must provide accurate business and job details",
      "Users are responsible for ensuring compliance with their country's employment laws",
    ],
  },
  {
    id: 3,
    title: "Job Posting Rules",
    content: "Employers agree that:",
    items: [
      "All job postings must be genuine and legal",
      "Posts must not contain offensive, misleading, or discriminatory content",
      "Salary, role, and requirements must be accurate",
      "Duplicate or spam job posts are prohibited",
      "We reserve the right to edit, reject, or remove any job post that violates these rules",
    ],
  },
  {
    id: 4,
    title: "Payments",
    items: [
      "Employers must pay the required fee before a job is published",
      "Packages and add-ons (e.g., Featured Post, Urgent Badge) are charged separately",
      "Payments are non-refundable once a job post is live, unless due to technical errors",
    ],
  },
  {
    id: 5,
    title: "User Responsibilities",
    items: [
      "Users must provide accurate information in their profiles, CVs, or job listings",
      "Employers are solely responsible for the hiring process and agreements with candidates",
      "Sharing false or fraudulent details may result in account suspension",
    ],
  },
  {
    id: 6,
    title: "Our Responsibilities",
    items: [
      "[Your Website Name] provides a platform to connect employers and job seekers",
      "We do not guarantee employment or candidate selection",
      "We are not responsible for the conduct of employers or job seekers",
    ],
  },
  {
    id: 7,
    title: "Prohibited Activities",
    content: "You may not:",
    items: [
      "Post fake jobs or apply with fake profiles",
      "Use our platform for spam, scams, or illegal activities",
      "Copy, modify, or distribute website content without permission",
    ],
  },
  {
    id: 8,
    title: "Account Suspension / Termination",
    content:
      "We may suspend or terminate any account that violates these Terms & Conditions without prior notice",
  },
  {
    id: 9,
    title: "Contact Us",
    content: "For questions, please contact: support@yourwebsitename.com",
  },
];

export default function RefundPolicy() {
  const { data, isLoading, isError } = useGetRefundPolicyQuery(undefined);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-500 text-lg">Loading Refund Policy...</p>
      </div>
    );
  }

  if (isError || !data?.data?.content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-red-500 text-lg">Failed to load Refund Policy.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-blue-lightest px-4 py-24">
      <div className="mx-auto max-w-[1170px]">
        <Card
          className={cn(
            "w-full rounded-xl",
            "border-2 border-border-input",
            "bg-white",
            "p-6 md:p-6",
          )}
        >
          {/* <div className="">
            <h1 className="mb-4 text-2xl font-bold text-gray-900 ">
              Refund Policy
            </h1>
            <p className="text-zinc-500 text-base font-normal">
              At SendUBack, we help people reconnect with the things that matter
              to them – even after they've checked out, flown home, or moved on
              to their next destination.
            </p>
          </div> */}

          <div
            className="rich-text-content rich-text-styles"
            dangerouslySetInnerHTML={{ __html: data.data.content }}
          />

          {/* Map through all sections and render them */}
          {/* {refundPolicyData.map((section) => (
            <div key={section.id} className="mb-8 last:mb-0">
              <h2 className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">
                {section.id}. {section.title}
              </h2>

              {section.content && (
                <p className="mb-3 text-base text-gray-700">
                  {section.content}
                </p>
              )}

              {section.items && section.items.length > 0 && (
                <ul className="space-y-2 pl-5">
                  {section.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))} */}
        </Card>
      </div>
    </main>
  );
}
