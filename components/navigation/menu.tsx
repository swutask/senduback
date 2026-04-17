import { cn } from "@/lib/utils";
import {
  getMenuData,
  MenuColumn,
  MenuItem,
  MenuKey,
  MenuLayout,
} from "./helper/menu";
import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Menu({
  value,
  layout,
  columns,
  menuKey,
  onMouseEnter,
  onMouseLeave,
}: {
  value: string | null;
  layout: MenuLayout;
  columns: MenuColumn[];
  menuKey: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const isSimple = layout === "simple";
  if (!value) return null;

  return (
    <Accordion.Root type="single" collapsible value={value}>
      <Accordion.Item value={menuKey} className="relative">
        <Accordion.Content
          forceMount
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={cn(
            "absolute left-1/2 top-full z-50 mt-4 -translate-x-1/2",
            "rounded-sm bg-[#F6F6F6] shadow-xl border border-gray-200",
            "before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:-translate-y-1/2",
            "before:h-4 before:w-4 before:rotate-45 before:bg-[#F6F6F6] before:border-gray-200 before:border-l before:border-t w-full",
            isSimple ? "w-[260px] p-4" : "w-xl p-6",
            "animate-in fade-in zoom-in-95 duration-150",
          )}
        >
          {layout === "simple" && (
            <div className="flex flex-col">
              {columns[0]?.items.map((item, i) => (
                <MenuLink key={i} {...item} />
              ))}
            </div>
          )}

          {layout === "twoColumn" && (
            <div className="grid grid-cols-2 gap-6">
              {columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className={cn(colIndex === 0 && "pr-6 border-r")}
                >
                  {col.items.map((item, i) => (
                    <MenuButton key={i} {...item} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

function MenuButton({
  label,
  description,
  highlight,
  href = "#",
  icon,
}: MenuItem) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-lg px-4 py-3 mb-2 transition text-nowrap",
        highlight
          ? "bg-[linear-gradient(110deg,#0099FF,#000080)] text-white"
          : "text-primary-new hover:bg-gray-50",
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <Image
            src={icon}
            alt={label}
            width={20}
            height={20}
            className="w-5 h-5 shrink-0"
          />
        )}

        <span className="font-medium text-sm">{label}</span>
      </div>

      {description && <span className="opacity-60 text-sm">{description}</span>}
    </Link>
  );
}

function MenuLink({ label, href = "#", icon }: MenuItem) {
  return (
    <Link
      href={href}
      className="flex items-center font-medium gap-3 px-4 py-3 rounded-lg text-primary-new text-sm hover:bg-gray-50"
    >
      {icon && (
        <Image
          src={icon}
          alt={label}
          width={20}
          height={20}
          className="w-5 h-5 shrink-0"
        />
      )}
      {label}
    </Link>
  );
}

export function AccordionNavItem({
  label,
  menuKey,
  href,
  onClose,
  type = "nested",
}: {
  label: string;
  menuKey: MenuKey;
  href?: string;
  onClose: () => void;
  type?: "default" | "nested"; // ** default for single links and nested for accordian based links
}) {
  const [isOpen, setIsOpen] = useState(false);
  const columns = getMenuData(menuKey);

  const allLinks = columns?.flatMap((col: any) => col.items ?? col) ?? [];

  if (type === "default") {
    return (
      <Link
        href={href ?? "#"}
        onClick={onClose}
        className={cn(
          "flex items-start gap-3 py-2.5 rounded-lg hover:bg-slate-50 transition group",
          "text-primary-new hover:bg-gray-50 font-semibold",
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className="text-base font-semibold text-primary-new">
          {label}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100 mb-2" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-0.5 pl-2">
          {allLinks.map((item: any, index: number) => (
            <Link
              key={`${item.href ?? item.label}-${index}`}
              href={item.href ?? href ?? "#"}
              onClick={onClose}
              className={cn(
                "flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition group",
                item.highlight
                  ? "bg-[linear-gradient(110deg,#0099FF,#000080)] text-white"
                  : "text-primary-new hover:bg-gray-50",
              )}
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="w-5 h-5 shrink-0"
                />
              )}
              <div className="leading-tight">
                <p className="text-sm font-medium group-hover:text-primary-new transition">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
