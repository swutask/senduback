import LostItemPage from "@/components/lost-item/lost-item";
import { LostItemProvider } from "@/contexts/lost-item-form.context";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Report Lost Item",
    description:
      "Report your lost item and schedule a secure return shipment with SendUBack.",
    alternates: {
      canonical: `https://senduback.com/orders/${id}`,
    },
  };
}

export default function page() {
  return (
    <LostItemProvider>
      <LostItemPage />
    </LostItemProvider>
  );
}
