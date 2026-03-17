import {
  FormStep,
  LostItemFormData,
  LostItemFormState,
  // ViewState,
} from "@/contexts/lost-item-form.context";
import { UseFormReturn } from "react-hook-form";

export const canProceed = async (
  state: LostItemFormState,
  form: UseFormReturn<LostItemFormData, any, LostItemFormData>,
) => {
  switch (state.currentStep) {
    case "location": {
      const businessName = form.watch("businessName");
      const placeName = form.watch("placeName");
      const isValid = await form.trigger(["email", "phone"]);

      return !!((businessName || placeName) && isValid);
    }
    case "item-details": {
      const items = form.watch("selectedItems");
      return !!items.length;
    }
    default:
      return true;
  }
};
