// import { Montserrat } from "next/font/google";
// import "./globals.css";
// import { ReduxProvider } from "@/redux/ReduxProvider";
// import GlobalLoader from "@/components/shared/global-loader";

// const montserrat = Montserrat({
//   variable: "--font-Montserrat",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
// });

// export const metadata = {
//   title: "SendUBack – Smart Lost & Found for Hotels, Airports & Businesses",
//   description:
//     "Recover lost items effortlessly with SendUBack. Insured, trackable, door-to-door returns for guests. Trusted by hotels, airports, car rentals, and events worldwide.",
//   keywords: [
//     "lost and found service",
//     "hotel lost and found",
//     "airport lost and found",
//     "lost item recovery",
//     "return lost items",
//     "guest item return",
//     "smart lost and found",
//     "SendUBack",
//     "hospitality tech",
//     "parcel return service",
//   ],

//   icons: {
//     icon: "/favicon.png",
//     shortcut: "/favicon.ico",
//     apple: "/apple-touch-icon.png",
//   },

//   openGraph: {
//     title: "SendUBack – Smart Lost & Found Made Simple",
//     description:
//       "Fast, secure and insured lost-and-found return service for hotels, airports, car rentals, and businesses.",
//     url: "https://senduback.com",
//     siteName: "SendUBack",
//     type: "website",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "SendUBack – Smart Lost & Found Platform",
//       },
//     ],
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "SendUBack – Smart Lost & Found for Modern Hospitality",
//     description:
//       "Trackable, insured item return service that helps guests get their belongings back in a few simple steps.",
//     images: ["/og-image.png"],
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//     <meta name="google-site-verification" content="X-5dLhfdV8e3G6hDwq44S6DxJcwQGMm0txIG7IBlm1c" />
//       <body className={`${montserrat.variable} antialiased`}>
//         <ReduxProvider>
//           <GlobalLoader>{children}</GlobalLoader>
//         </ReduxProvider>
//       </body>

//       <script
//         src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
//         async
//       />
//     </html>
//   );
// }

import { Arimo, Montserrat } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/ReduxProvider";
import GlobalLoader from "@/components/shared/global-loader";
import Script from "next/script";
import type { Metadata } from "next";
import CookieBanner from "@/components/cookie/cookie-banner";

const montserrat = Montserrat({
  variable: "--font-Montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const arimo = Arimo({
  variable: "--font-Arimo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://senduback.com"),

  title: {
    default: "SendUBack | Lost & Found Platform for Hotels & Guests",
    template: "%s | SendUBack",
  },

  description:
    "SendUBack helps hotels manage lost items in one simple dashboard and helps guests book shipment to get their lost items returned securely worldwide. SendUBack is sometimes searched as 'Send You Back' or 'Send U Back'.",

  keywords: [
    "lost and found service",
    "hotel lost and found",
    "airport lost and found",
    "lost item recovery",
    "return lost items",
    "guest item return",
    "smart lost and found",
    "SendUBack",
    "hospitality tech",
    "parcel return service",
  ],

  verification: {
    google: "X-5dLhfdV8e3G6hDwq44S6DxJcwQGMm0txIG7IBlm1c",
  },

  openGraph: {
    title: "SendUBack – Smart Lost & Found Made Simple",
    description:
      "Fast, secure and insured lost-and-found return service for hotels, airports, car rentals, and businesses.",
    url: "https://senduback.com",
    siteName: "SendUBack",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SendUBack – Smart Lost & Found Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SendUBack – Smart Lost & Found for Modern Hospitality",
    description:
      "Trackable, insured item return service that helps guests get their belongings back in a few simple steps.",
    images: ["/opengraph-image.png"],
  },

  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="X-5dLhfdV8e3G6hDwq44S6DxJcwQGMm0txIG7IBlm1c"
        />

        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon-57x57.png"
          sizes="57x57"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon-114x114.png"
          sizes="114x114"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon-120x120.png"
          sizes="120x120"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon-180x180.png"
          sizes="180x180"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SendUBack",
              alternateName: ["Send You Back", "Send U Back"],
              url: "https://senduback.com",
            }),
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${arimo.variable} antialiased`}>
        <ReduxProvider>
          <GlobalLoader>{children}</GlobalLoader>
        </ReduxProvider>

        <CookieBanner
          cookiePolicyHref="/cookie-policy"
          privacyPolicyHref="/privacy-policy"
        />

        {/* Google Maps */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
