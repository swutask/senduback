"use client";

import { Card } from "@/components/ui/card";
import { useGetRefundPolicyQuery } from "@/redux/features/public/publicApi";
import Image from "next/image";

// Define the type for each section to make the code type-safe
interface Section {
  id: number;
  title: string;
  content?: string;
  items?: string[];
}

export default function PrivacyPolicy() {
  const { data, isLoading, isError } = useGetRefundPolicyQuery(undefined);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-500 text-lg">Loading Privacy Policy...</p>
      </div>
    );
  }

  if (isError || !data?.data?.content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-red-500 text-lg">Failed to load Privacy Policy.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#e6f2ff] px-4 py-24">
      {/* Container for max-width on larger screens */}
      <div className="mx-auto max-w-7xl lg:px-4">
        {/* Main Content Card */}
        <Card className="border-2 border-blue-200 bg-blue-50 p-6 md:p-8">
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
            className="rich-text-content"
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
