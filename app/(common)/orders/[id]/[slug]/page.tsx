import ShippingPage from "@/components/shipping/shipping-page";
import React from "next";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;
  return {
    title: "Ship Lost Item",
    description:
      "Ship your lost item back securely with SendUBack's insured shipping service.",
    alternates: {
      canonical: `https://senduback.com/orders/${id}/${slug}`,
    },
    robots: "noindex, follow",
  };
}

export default function page() {
  return (
    <div>
      <ShippingPage />
    </div>
  );
}
