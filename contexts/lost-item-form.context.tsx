"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";

export type FormStep = "location" | "item-details" | "delivery" | "shipping";

export type ViewState =
  | "search"
  | "manual"
  | "confirmed"
  | "category"
  | "item-list"
  | "select"
  | "recipient"
  | "confirmed"
  | "loading";

const STEP_ORDER: FormStep[] = [
  "location",
  "item-details",
  "delivery",
  "shipping",
];

export interface LostItemFormState {
  currentStep: FormStep;
  view: ViewState;
  orderId: string | null;
}

const initialState: LostItemFormState = {
  currentStep: "location",
  view: "search",
  orderId: null,
};

export type FormAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_DEFAULT_VIEW"; payload: ViewState }
  | { type: "GO_TO_STEP"; payload: FormStep }
  | { type: "SET_VIEW"; payload: ViewState }
  | { type: "SET_ORDER_ID"; payload: string };

const STEP_ALLOWED_VIEWS: Record<FormStep, ViewState[]> = {
  location: ["search", "manual", "confirmed"],
  "item-details": ["category", "item-list"],
  delivery: ["select", "recipient", "manual", "confirmed"],
  shipping: ["loading", "select", "confirmed"],
};

function getDefaultView(step: FormStep): ViewState {
  return STEP_ALLOWED_VIEWS[step][0];
}
0;
function isViewAllowed(step: FormStep, view: ViewState) {
  return STEP_ALLOWED_VIEWS[step].includes(view);
}

function getNextStep(current: FormStep): FormStep {
  const idx = STEP_ORDER.indexOf(current);
  return idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : current;
}

function getPrevStep(current: FormStep): FormStep {
  const idx = STEP_ORDER.indexOf(current);
  return idx > 0 ? STEP_ORDER[idx - 1] : current;
}

function lostItemReducer(
  state: LostItemFormState,
  action: FormAction,
): LostItemFormState {
  switch (action.type) {
    case "NEXT_STEP":
      const nextStep = getNextStep(state.currentStep);
      return {
        ...state,
        currentStep: getNextStep(state.currentStep),
        view: getDefaultView(nextStep),
      };

    case "PREV_STEP":
      const prevStep = getPrevStep(state.currentStep);
      return {
        ...state,
        currentStep: getPrevStep(state.currentStep),
        view: getDefaultView(prevStep),
      };

    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.payload,
        view: getDefaultView(action.payload),
      };

    case "SET_VIEW": {
      if (!isViewAllowed(state.currentStep, action.payload)) {
        return state;
      }

      return {
        ...state,
        view: action.payload,
      };
    }

    case "SET_ORDER_ID": {
      return { ...state, orderId: action.payload };
    }

    default:
      return state;
  }
}

declare global {
  interface Window {
    google?: any;
  }
}

export interface SelectedItem {
  name: string;
  category: string;
  subcategory: string;
  description?: string;
  icon?: StaticImport;
}

export interface LostItemFormData {
  name: string;
  businessName: string;
  email: string;
  phone: number;
  location: string;
  placeName: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  countryName: string;
  postalCode: string;
  selectedItems: SelectedItem[];
  sendAddress: string;
  sendCountry: string;
  sendStreet: string;
  sendState: string;
  address2: string;
  sendCity: string;
  sendCountryCode: string;
  sendPostalCode: string;
  sendBusinessName: string;
  notes: string;
  sendFullName: string;
  sendCompanyName: string;
  sendMobilePhone: string;
  sendEmail: string;
  shareOrderDetails: boolean;
}

interface LostItemContextValue {
  state: LostItemFormState;
  dispatch: React.Dispatch<FormAction>;

  form: UseFormReturn<LostItemFormData, any, LostItemFormData>;
  actions: {
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: FormStep) => void;
    setView: (view: ViewState) => void;
    setOrderId: (id: string) => void;
  };
}

const LostItemContext = createContext<LostItemContextValue | null>(null);

export function LostItemProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lostItemReducer, initialState);

  const form = useForm<LostItemFormData>({
    defaultValues: {
      selectedItems: [],
      shareOrderDetails: false,
      location: "",
      street1: "",
      sendPostalCode: "",
      postalCode: "",
    },
  });

  const actions: LostItemContextValue["actions"] = {
    nextStep: useCallback(() => dispatch({ type: "NEXT_STEP" }), []),
    prevStep: useCallback(() => dispatch({ type: "PREV_STEP" }), []),
    goToStep: useCallback(
      (step) => dispatch({ type: "GO_TO_STEP", payload: step }),
      [],
    ),
    setView: useCallback(
      (view) => dispatch({ type: "SET_VIEW", payload: view }),
      [],
    ),
    setOrderId: useCallback(
      (id) => dispatch({ type: "SET_ORDER_ID", payload: id }),
      [],
    ),
  };

  return (
    <LostItemContext.Provider value={{ state, dispatch, actions, form }}>
      {children}
    </LostItemContext.Provider>
  );
}

export function useLostItemForm() {
  const ctx = useContext(LostItemContext);
  if (!ctx) {
    throw new Error("useLostItemForm must be used inside <LostItemProvider>");
  }
  return ctx;
}
