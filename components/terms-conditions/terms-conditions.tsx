// "use client";

// import { Card } from "@/components/ui/card";

// const termsData = [
//   {
//     id: 1,
//     title: "About SendUBack",
//     content: (
//       <>
//         <p>
//           SendUBack is a digital platform that facilitates the recovery and
//           return of lost items by coordinating between guests, hotels,
//           hospitality businesses, and third-party delivery providers.
//         </p>
//         <p className="mt-2">
//           SendUBack is not a courier company and does not physically transport
//           items directly. Shipping services are provided through third-party
//           courier partners.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 2,
//     title: "Scope of Service",
//     content: (
//       <>
//         <p>SendUBack enables:</p>
//         <ul className="list-disc pl-5 mt-2 space-y-1">
//           <li>
//             Hotels and hospitality businesses to manage lost items through the
//             SendUBack dashboard.
//           </li>
//           <li>Guests to arrange shipment and delivery of lost belongings.</li>
//           <li>Secure payment collection and shipment tracking.</li>
//         </ul>
//         <p className="mt-2">
//           Shipment can only proceed once the item is confirmed available by the
//           holding location.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 3,
//     title: "Eligibility",
//     content: (
//       <>
//         <p>
//           SendUBack services may be used by hotels, serviced apartments, Airbnb
//           hosts, hospitality businesses, and guests requesting return of lost
//           items.
//         </p>
//         <p className="mt-2">
//           Users agree to provide accurate information when using the platform.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 4,
//     title: "Dashboard Use (Hotels & Businesses)",
//     content: (
//       <>
//         <p>Hotels and businesses using the SendUBack dashboard agree to:</p>
//         <ul className="list-disc pl-5 mt-2 space-y-1">
//           <li>Provide accurate item information.</li>
//           <li>Confirm item identity before release.</li>
//           <li>Cooperate with shipment arrangements.</li>
//         </ul>
//         <p className="mt-2">
//           Hotels acknowledge that once an item is handed over to SendUBack or
//           its delivery partner, liability for shipping transfers to SendUBack in
//           accordance with these Terms.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 5,
//     title: "Guest Communication Authorisation",
//     content: (
//       <>
//         <p>
//           Hotels and all users of the SendUBack dashboard agree that SendUBack
//           may contact guests directly regarding their lost items, including
//           communication related to recovery, payment, shipping arrangements,
//           tracking updates, and support.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 6,
//     title: "Payments",
//     content: (
//       <>
//         <ul className="list-disc pl-5 space-y-1">
//           <li>Payment is required before shipping.</li>
//           <li>
//             Payments are processed via secure third-party payment providers.
//           </li>
//           <li>Shipping charges are displayed before payment confirmation.</li>
//           <li>
//             All prices are subject to change based on courier rates and
//             destination.
//           </li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     id: 7,
//     title: "Shipping & Delivery",
//     content: (
//       <>
//         <ul className="list-disc pl-5 space-y-1">
//           <li>Delivery times are estimates and not guaranteed.</li>
//           <li>Shipping is carried out by third-party courier companies.</li>
//           <li>
//             SendUBack is not responsible for delays caused by couriers, customs,
//             or events outside our control.
//           </li>
//         </ul>
//         <p className="mt-2">
//           Guests may book shipments from anywhere to anywhere subject to courier
//           availability and regulations.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 8,
//     title: "Item Condition & Shipping Damage",
//     content: (
//       <>
//         <p>
//           SendUBack does not inspect or verify the condition of items provided
//           by hotels or businesses. Items are shipped in the condition received
//           from the holding location.
//         </p>
//         <p className="mt-2">
//           If an item is damaged during shipment, claims may be submitted where
//           shipping protection or insurance has been selected, and are subject to
//           courier or insurer approval and supporting evidence.
//         </p>
//         <p className="mt-2">
//           If no insurance is selected, SendUBack will not be able to refund the
//           declared item value.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 9,
//     title: "Insurance & Protection",
//     content: (
//       <>
//         <ul className="list-disc pl-5 mt-2 space-y-1">
//           <li>Shipping insurance may be offered during checkout.</li>
//           <li>Insurance is optional unless otherwise stated.</li>
//           <li>
//             Claims are subject to insurer approval and supporting evidence.
//           </li>
//         </ul>
//         <p className="mt-2">
//           SendUBack strongly encourages customers to fully insure valuable
//           items.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 10,
//     title: "High-Value Item Verification",
//     content: (
//       <>
//         <p>
//           For items insured with a declared value above £100, SendUBack may
//           require the customer to complete an Item Authenticity &amp;
//           Declaration Form before shipment.
//         </p>
//         <p className="mt-2">
//           Failure to complete this form may result in reduced insurance
//           eligibility or cancellation of the shipment request.
//         </p>
//         <p className="mt-2">
//           This process helps ensure accurate insurance coverage and smoother
//           claim handling.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 11,
//     title: "Customer Information Accuracy",
//     content: (
//       <>
//         <p>
//           Customers are responsible for providing accurate shipping information.
//         </p>
//         <p className="mt-2">
//           SendUBack is not responsible for delays, losses, or additional charges
//           resulting from incorrect or incomplete details provided during
//           booking.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 12,
//     title: "Ownership Responsibility",
//     content: (
//       <>
//         <p>
//           The person requesting shipment confirms they are legally authorised to
//           receive the item.
//         </p>
//         <p className="mt-2">
//           SendUBack is not responsible for ownership disputes between guests,
//           hotels, or third parties.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 13,
//     title: "Unclaimed or Returned Shipments",
//     content: (
//       <>
//         <p>If a shipment is refused, returned, or unclaimed by the receiver:</p>
//         <ul className="list-disc pl-5 mt-2 space-y-1">
//           <li>Additional charges may apply.</li>
//           <li>Re-shipping or storage costs may be charged.</li>
//           <li>Refunds may not be available.</li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     id: 14,
//     title: "Events Outside Our Control (Force Majeure)",
//     content: (
//       <>
//         <p>
//           SendUBack shall not be liable for delays or failures caused by
//           circumstances beyond reasonable control, including customs delays,
//           weather conditions, transportation disruptions, governmental
//           restrictions, strikes, or unforeseen events.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 15,
//     title: "No Guarantee of Recovery",
//     content: (
//       <>
//         <p>
//           SendUBack cannot guarantee that a lost item will be found or released
//           by the holding location. Shipment can only proceed when the item is
//           confirmed available.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 16,
//     title: "Limitation of Liability",
//     content: (
//       <>
//         <p>
//           SendUBack’s liability is limited to the value covered under selected
//           insurance or shipping protection.
//         </p>
//         <p className="mt-2">
//           SendUBack is not responsible for indirect or consequential losses.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 17,
//     title: "Indemnity",
//     content: (
//       <>
//         <p>
//           Users agree to indemnify and hold SendUBack harmless against claims,
//           losses, or damages arising from misuse of the platform or breach of
//           these Terms.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 18,
//     title: "Privacy & Data Protection",
//     content: (
//       <>
//         <p>
//           SendUBack uses secure systems to process personal data and payments.
//           By using the platform, users agree to data processing necessary to
//           provide the service.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 19,
//     title: "Support",
//     content: (
//       <>
//         <p>Support is available through:</p>
//         <ul className="list-disc pl-5 mt-2 space-y-1">
//           <li>Help section on the platform</li>
//           <li>Email: support@senduback.com</li>
//           <li>Phone and WhatsApp support</li>
//         </ul>
//       </>
//     ),
//   },
//   {
//     id: 20,
//     title: "Changes to These Terms",
//     content: (
//       <>
//         <p>
//           SendUBack may update these Terms from time to time. Continued use of
//           the platform means acceptance of any updates.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 21,
//     title: "Governing Law",
//     content: (
//       <>
//         <p>These Terms shall be governed by the laws of [England and Wales].</p>
//       </>
//     ),
//   },
// ];

// export default function TermsAndConditions() {
//   return (
//     <main className="relative min-h-screen bg-transparent px-4 py-16 md:py-24">
//       <div className="mx-auto max-w-7xl lg:px-4 ">
//         <Card className="bg-white border-[##E5E7EB]  rounded-[12px] border-4 p-6 sm:p-8 md:p-12">
//           <div className="mb-10 text-[#65758B] font-medium text-base leading-[1.6]">
//             Welcome to SendUBack. By accessing or using the SendUBack platform,
//             website, or dashboard, you agree to these Terms & Conditions. Please
//             read them carefully before using our services.
//           </div>

//           <div className="space-y-8">
//             {termsData.map((section) => (
//               <div key={section.id} className="flex flex-col">
//                 <h2 className="text-xl font-bold text-[#000080] mb-3">
//                   {section.id}. {section.title}
//                 </h2>
//                 <div className="text-[#65758B] font-medium text-sm md:text-base leading-[1.6]">
//                   {section.content}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>
//     </main>
//   );
// }

"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetTermsAndConditionsQuery } from "@/redux/features/public/publicApi";

// Define the type for each section to make the code type-safe
interface Section {
  id: number;
  title: string;
  content?: string;
  items?: string[];
}

// Array of all Terms & Conditions sections
// This makes it easy to add or modify sections
const termsData: Section[] = [
  {
    id: 1,
    title: "Acceptance of Terms",
    content:
      "By creating an account, posting a job, or applying for a job, you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please stop using our services.",
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

export default function TermsAndConditions() {
  const { data, isLoading, isError } = useGetTermsAndConditionsQuery(undefined);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-gray-500 text-lg">Loading Terms & Conditions...</p>
      </div>
    );
  }

  if (isError || !data?.data?.content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-red-500 text-lg">
          Failed to load Terms & Conditions.
        </p>
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
          <div
            className="rich-text-content rich-text-styles"
            dangerouslySetInnerHTML={{ __html: data.data.content }}
          />

          {/* {termsData.map((section) => (
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
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-400" />
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
