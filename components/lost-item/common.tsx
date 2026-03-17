"use client";
import { SelectedItem } from "@/contexts/lost-item-form.context";
import { cn } from "@/lib/utils";
import { motion, steps } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  gradient: string;
  hasSubcategories: boolean;
  subcategories: { id: string; name: string }[];
}

import {
  FileText,
  Smartphone,
  Shirt,
  Gem,
  Briefcase,
  Dumbbell,
  Key,
  MoreHorizontal,
  Trash2,
  Pencil,
  Box,
  Search,
  LucideIcon,
} from "lucide-react";

const inputBase = cn(
  "w-full h-11 rounded-xl border border-slate-200 bg-white px-4",
  "text-[14px] text-slate-700 placeholder:text-slate-400",
  "outline-none transition-all",
  "focus:border-[#1D6FF2] focus:ring-2 focus:ring-[#1D6FF2]/10",
);

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[15px] font-semibold text-[#000080] mb-0.5">
      {children}
    </label>
  );
}

export function Field({
  label,
  children,
  className,
  error,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        inputBase,
        "h-24 py-3 resize-none leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GradientButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "w-full h-12 rounded-xl text-white font-semibold text-[15px]",
        "transition-all hover:opacity-90 active:scale-[0.98]",
        className,
      )}
      style={{
        background: "linear-gradient(110.24deg, #0099FF 0%, #000080 100%)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export const CATEGORIES = [
  {
    id: "documents",
    name: "Documents & IDs",
    icon: FileText,
    gradient: "#0071F8",
    hasSubcategories: true,
    subcategories: [
      { id: "Passport", name: "Passport" },
      { id: "ID Card", name: "ID Card" },
      { id: "Drivers Licence", name: "Drivers Licence" },
      { id: "Professional Card", name: "Professional Card" },
      { id: "Credit Cards", name: "Credit Cards" },
      { id: "Purse", name: "Purse" },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Smartphone,
    gradient: "#A534F7",
    hasSubcategories: true,
    subcategories: [
      { id: "Smartphone", name: "Smart phone" },
      { id: "Laptop", name: "Laptop" },
      { id: "Tablet", name: "Tablet" },
      { id: "Camera", name: "Camera" },
      { id: "Charger", name: "Charger" },
      { id: "Smartwatch", name: "Smartwatch" },
      { id: "e-reader", name: "E-reader" },
      { id: "Headphones & Airpods", name: "Headphones & Airpods" },
      { id: "Game Console", name: "Game Console" },
    ],
  },
  {
    id: "clothes",
    name: "Clothing",
    icon: Shirt,
    gradient: "#F71188",
    hasSubcategories: true,
    subcategories: [
      { id: "Trousers", name: "Trousers" },
      { id: "Shorts", name: "Shorts" },
      { id: "Blouse", name: "Blouse" },
      { id: "Shirt", name: "Shirt" },
      { id: "Skirt", name: "Skirt" },
      { id: "Jacket", name: "Jacket" },
      { id: "Swimsuit", name: "Swimsuit" },
      { id: "Sweatshirt - Hoodie", name: "Sweatshirt - Hoodie" },
      { id: "Shoes", name: "Shoes" },
      { id: "Belt", name: "Belt" },
      { id: "Hat", name: "Hat" },
    ],
  },
  {
    id: "jewelry",
    name: "Jewelry",
    icon: Gem,
    gradient: "#F48100",
    hasSubcategories: true,
    subcategories: [
      { id: "Ring", name: "Ring" },
      { id: "Earring", name: "Earring" },
      { id: "Bracelet", name: "Bracelet" },
      { id: "Necklace", name: "Necklace" },
      { id: "Watch", name: "Watch" },
    ],
  },
  {
    id: "bags",
    name: "Bags & Suitcases",
    icon: Briefcase,
    gradient: "#00B041",
    hasSubcategories: true,
    subcategories: [
      { id: "Handbag", name: "Handbag" },
      { id: "Backpack", name: "Backpack" },
      { id: "Large suitcase", name: "Large suitcase" },
      { id: "Small cabin bag", name: "Small cabin bag" },
      { id: "Purse, Pencil case", name: "Purse, Pencil case" },
      { id: "Shopping bag", name: "Shopping bag" },
      { id: "Fanny pack", name: "Fanny pack" },
    ],
  },
  {
    id: "sports",
    name: "Sports gear",
    icon: Dumbbell,
    gradient: "#FA0927",
    hasSubcategories: true,
    subcategories: [
      { id: "Surf", name: "Surf" },
      { id: "Kite", name: "Kite" },
      { id: "Ski", name: "Ski" },
      { id: "Golf bag", name: "Golf bag" },
      { id: "Tennis", name: "Tennis" },
      { id: "Bicycle", name: "Bicycle" },
      { id: "Other Sport Gear", name: "Other Sport Gear" },
    ],
  },
  {
    id: "personal",
    name: "Personal Items",
    icon: Key,
    gradient: "#009DBF",
    hasSubcategories: true,
    subcategories: [
      { id: "Keys", name: "Keys" },
      { id: "Glasses", name: "Glasses" },
      { id: "Perfume", name: "Perfume" },
    ],
  },
  {
    id: "Other",
    name: "Others",
    icon: MoreHorizontal,
    gradient: "#5D6675",
    hasSubcategories: false,
    subcategories: [],
  },
];

export function StepHeader({
  title,
  subtitle,
  Icon = Box,
  totalStep = 4,
  step,
}: {
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  step?: number;
  totalStep?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3 mb-8 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0099FF 0%, #000080 100%)",
        }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0d1b8e] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[16px] text-[#5a5a70] mt-1">{subtitle}</p>
        )}
        {step && (
          <p className="font-medium text-[14px] text-slate-400 mt-1">
            Step {step} of {totalStep}
          </p>
        )}
      </div>
    </div>
  );
}

export function CategoryCard({
  category,
  selected,
  onClick,
}: {
  category: Category;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = category.icon;
  return (
    <motion.button
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-5 sm:p-6",
        "rounded-2xl border text-center transition-all duration-200 cursor-pointer",
        selected
          ? "border-[#1D6FF2] bg-blue-50/60 shadow-md"
          : "border-slate-100 bg-white hover:border-[#1D6FF2]/40 hover:shadow-sm shadow-sm",
      )}
    >
      <div
        className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center"
        style={{ background: category.gradient }}
      >
        <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
      </div>
      <span
        className={cn(
          "text-[12px] text-center sm:text-[14px] font-bold leading-tight",
          selected ? "text-[#1D6FF2]" : "text-[#0d1b8e]",
        )}
      >
        {category.name}
      </span>
    </motion.button>
  );
}

export function ItemRow({
  item,
  onEdit,
  onDelete,
}: {
  item: SelectedItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.name === item.category);
  const Icon = cat?.icon ?? Box;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background:
            cat?.gradient ?? "linear-gradient(135deg,#1D6FF2,#000080)",
        }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-[#0d1b8e] truncate">
          {item.name}
        </p>
        <p className="text-[12px] text-slate-400 mt-0.5">{item.category}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#1D6FF2] hover:bg-blue-50 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>
    </motion.div>
  );
}

export function LinkButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "text-[14px] font-medium text-[#1D6FF2] hover:text-[#000080] transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconBadge({
  icon: Icon,
  size = "md",
  variant = "default",
}: {
  icon: React.ElementType;
  size?: "sm" | "md";
  variant?: "outline" | "default";
}) {
  const styles =
    variant === "default"
      ? "rounded-xl bg-[#E0EFFF]"
      : "rounded-full border-[#1E63F04D] border-2";

  return (
    <div
      className={cn(
        styles,
        "flex items-center justify-center shrink-0",
        size === "sm" ? "w-9 h-9" : "w-10 h-10",
      )}
    >
      <Icon
        className={cn("text-[#1D6FF2]", size === "sm" ? "w-4 h-4" : "w-5 h-5")}
      />
    </div>
  );
}

export function TwoCol({
  children,
  mobileLayout = "oneCol",
}: {
  children: React.ReactNode;
  mobileLayout?: "oneCol" | "twoCol";
}) {
  const styles =
    mobileLayout === "oneCol" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2";
  return <div className={`grid ${styles} gap-4`}>{children}</div>;
}

export function SearchBar({
  readOnly,
  onClick,
  onChange,
  value,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  readOnly?: boolean;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <Input
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        onClick={onClick}
        placeholder="Search for hotel…"
        className={cn(
          "pl-11 h-12",
          readOnly && "cursor-pointer hover:border-[#1D6FF2]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

export const COUNTRIES_DATA: { label: string; code: string }[] = [
  { label: "Afghanistan", code: "AF" },
  { label: "Albania", code: "AL" },
  { label: "Algeria", code: "DZ" },
  { label: "Andorra", code: "AD" },
  { label: "Angola", code: "AO" },
  { label: "Argentina", code: "AR" },
  { label: "Armenia", code: "AM" },
  { label: "Australia", code: "AU" },
  { label: "Austria", code: "AT" },
  { label: "Azerbaijan", code: "AZ" },
  { label: "Bahamas", code: "BS" },
  { label: "Bahrain", code: "BH" },
  { label: "Bangladesh", code: "BD" },
  { label: "Belarus", code: "BY" },
  { label: "Belgium", code: "BE" },
  { label: "Belize", code: "BZ" },
  { label: "Benin", code: "BJ" },
  { label: "Bhutan", code: "BT" },
  { label: "Bolivia", code: "BO" },
  { label: "Bosnia and Herzegovina", code: "BA" },
  { label: "Botswana", code: "BW" },
  { label: "Brazil", code: "BR" },
  { label: "Brunei", code: "BN" },
  { label: "Bulgaria", code: "BG" },
  { label: "Burkina Faso", code: "BF" },
  { label: "Burundi", code: "BI" },
  { label: "Cambodia", code: "KH" },
  { label: "Cameroon", code: "CM" },
  { label: "Canada", code: "CA" },
  { label: "Cape Verde", code: "CV" },
  { label: "Central African Republic", code: "CF" },
  { label: "Chad", code: "TD" },
  { label: "Chile", code: "CL" },
  { label: "China", code: "CN" },
  { label: "Colombia", code: "CO" },
  { label: "Comoros", code: "KM" },
  { label: "Congo", code: "CG" },
  { label: "Costa Rica", code: "CR" },
  { label: "Croatia", code: "HR" },
  { label: "Cuba", code: "CU" },
  { label: "Cyprus", code: "CY" },
  { label: "Czech Republic", code: "CZ" },
  { label: "Denmark", code: "DK" },
  { label: "Djibouti", code: "DJ" },
  { label: "Dominican Republic", code: "DO" },
  { label: "Ecuador", code: "EC" },
  { label: "Egypt", code: "EG" },
  { label: "El Salvador", code: "SV" },
  { label: "Equatorial Guinea", code: "GQ" },
  { label: "Eritrea", code: "ER" },
  { label: "Estonia", code: "EE" },
  { label: "Eswatini", code: "SZ" },
  { label: "Ethiopia", code: "ET" },
  { label: "Fiji", code: "FJ" },
  { label: "Finland", code: "FI" },
  { label: "France", code: "FR" },
  { label: "Gabon", code: "GA" },
  { label: "Gambia", code: "GM" },
  { label: "Georgia", code: "GE" },
  { label: "Germany", code: "DE" },
  { label: "Ghana", code: "GH" },
  { label: "Greece", code: "GR" },
  { label: "Guatemala", code: "GT" },
  { label: "Guinea", code: "GN" },
  { label: "Guinea-Bissau", code: "GW" },
  { label: "Guyana", code: "GY" },
  { label: "Haiti", code: "HT" },
  { label: "Honduras", code: "HN" },
  { label: "Hungary", code: "HU" },
  { label: "Iceland", code: "IS" },
  { label: "India", code: "IN" },
  { label: "Indonesia", code: "ID" },
  { label: "Iran", code: "IR" },
  { label: "Iraq", code: "IQ" },
  { label: "Ireland", code: "IE" },
  { label: "Israel", code: "IL" },
  { label: "Italy", code: "IT" },
  { label: "Jamaica", code: "JM" },
  { label: "Japan", code: "JP" },
  { label: "Jordan", code: "JO" },
  { label: "Kazakhstan", code: "KZ" },
  { label: "Kenya", code: "KE" },
  { label: "Kuwait", code: "KW" },
  { label: "Kyrgyzstan", code: "KG" },
  { label: "Laos", code: "LA" },
  { label: "Latvia", code: "LV" },
  { label: "Lebanon", code: "LB" },
  { label: "Lesotho", code: "LS" },
  { label: "Liberia", code: "LR" },
  { label: "Libya", code: "LY" },
  { label: "Liechtenstein", code: "LI" },
  { label: "Lithuania", code: "LT" },
  { label: "Luxembourg", code: "LU" },
  { label: "Madagascar", code: "MG" },
  { label: "Malawi", code: "MW" },
  { label: "Malaysia", code: "MY" },
  { label: "Maldives", code: "MV" },
  { label: "Mali", code: "ML" },
  { label: "Malta", code: "MT" },
  { label: "Mauritania", code: "MR" },
  { label: "Mauritius", code: "MU" },
  { label: "Mexico", code: "MX" },
  { label: "Moldova", code: "MD" },
  { label: "Monaco", code: "MC" },
  { label: "Mongolia", code: "MN" },
  { label: "Montenegro", code: "ME" },
  { label: "Morocco", code: "MA" },
  { label: "Mozambique", code: "MZ" },
  { label: "Myanmar", code: "MM" },
  { label: "Namibia", code: "NA" },
  { label: "Nepal", code: "NP" },
  { label: "Netherlands", code: "NL" },
  { label: "New Zealand", code: "NZ" },
  { label: "Nicaragua", code: "NI" },
  { label: "Niger", code: "NE" },
  { label: "Nigeria", code: "NG" },
  { label: "North Korea", code: "KP" },
  { label: "North Macedonia", code: "MK" },
  { label: "Norway", code: "NO" },
  { label: "Oman", code: "OM" },
  { label: "Pakistan", code: "PK" },
  { label: "Palestine", code: "PS" },
  { label: "Panama", code: "PA" },
  { label: "Papua New Guinea", code: "PG" },
  { label: "Paraguay", code: "PY" },
  { label: "Peru", code: "PE" },
  { label: "Philippines", code: "PH" },
  { label: "Poland", code: "PL" },
  { label: "Portugal", code: "PT" },
  { label: "Qatar", code: "QA" },
  { label: "Romania", code: "RO" },
  { label: "Russia", code: "RU" },
  { label: "Rwanda", code: "RW" },
  { label: "Saudi Arabia", code: "SA" },
  { label: "Senegal", code: "SN" },
  { label: "Serbia", code: "RS" },
  { label: "Sierra Leone", code: "SL" },
  { label: "Singapore", code: "SG" },
  { label: "Slovakia", code: "SK" },
  { label: "Slovenia", code: "SI" },
  { label: "Somalia", code: "SO" },
  { label: "South Africa", code: "ZA" },
  { label: "South Korea", code: "KR" },
  { label: "South Sudan", code: "SS" },
  { label: "Spain", code: "ES" },
  { label: "Sri Lanka", code: "LK" },
  { label: "Sudan", code: "SD" },
  { label: "Sweden", code: "SE" },
  { label: "Switzerland", code: "CH" },
  { label: "Syria", code: "SY" },
  { label: "Taiwan", code: "TW" },
  { label: "Tajikistan", code: "TJ" },
  { label: "Tanzania", code: "TZ" },
  { label: "Thailand", code: "TH" },
  { label: "Timor-Leste", code: "TL" },
  { label: "Togo", code: "TG" },
  { label: "Trinidad and Tobago", code: "TT" },
  { label: "Tunisia", code: "TN" },
  { label: "Turkey", code: "TR" },
  { label: "Turkmenistan", code: "TM" },
  { label: "Uganda", code: "UG" },
  { label: "Ukraine", code: "UA" },
  { label: "United Arab Emirates", code: "AE" },
  { label: "United Kingdom", code: "GB" },
  { label: "United States", code: "US" },
  { label: "Uruguay", code: "UY" },
  { label: "Uzbekistan", code: "UZ" },
  { label: "Venezuela", code: "VE" },
  { label: "Vietnam", code: "VN" },
  { label: "Yemen", code: "YE" },
  { label: "Zambia", code: "ZM" },
  { label: "Zimbabwe", code: "ZW" },
];

export const COUNTRIES = COUNTRIES_DATA.map((c) => ({
  ...c,
  flag: getFlagEmoji(c.code),
}));

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export function IconInput({
  icon: Icon,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ElementType }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <Input className={cn("pl-10", className, "bg-[#F8FAFC]!")} {...props} />
    </div>
  );
}

export const PLACEHOLDERS = [
  "Enter the location address...",
  "Search for hotel, restaurant, or venue...",
  "Type the name of the business...",
];

const TYPING_SPEED = 45;
const DELETING_SPEED = 22;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 400;

export function useTypewriterPlaceholder(texts: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [phase, setPhase] = useState<
    "typing" | "pausing" | "deleting" | "waiting"
  >("typing");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const current = texts[textIndex];

    if (phase === "typing") {
      if (displayed.length < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, TYPING_SPEED);
      } else {
        timeoutRef.current = setTimeout(
          () => setPhase("pausing"),
          PAUSE_AFTER_TYPE,
        );
      }
    } else if (phase === "pausing") {
      setPhase("deleting");
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed((prev) => prev.slice(0, -1));
        }, DELETING_SPEED);
      } else {
        timeoutRef.current = setTimeout(() => {
          setTextIndex((i) => (i + 1) % texts.length);
          setPhase("typing");
        }, PAUSE_AFTER_DELETE);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, textIndex, texts]);

  return displayed;
}
