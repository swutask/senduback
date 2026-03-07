import LostItemPage from "@/components/lost-item/lost-item";
import { LostItemProvider } from "@/contexts/lost-item-form.context";

export default function page() {
  return (
    <LostItemProvider>
      <LostItemPage />
    </LostItemProvider>
  );
}
