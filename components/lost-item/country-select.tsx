"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "./common";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface CountrySelectProps {
  value: string;
  onChange: (code: string, label: string) => void;
  error?: string;
}

export function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const popularCountries = useMemo(
    () => COUNTRIES.filter((c) => POPULAR_CODES.includes(c.code)),
    [],
  );

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [search]);

  const selected = COUNTRIES.find((c) => c.code === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (code: string, label: string) => {
    onChange(code, label);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full h-11 rounded-xl border bg-white px-3 py-2 text-sm text-left flex items-center justify-between gap-2 transition-all",
          open
            ? "border-[#1D6FF2] ring-2 ring-[#1D6FF2]/20"
            : error
              ? "border-red-400"
              : "border-input hover:border-slate-300",
        )}
      >
        {selected ? (
          <span className="flex items-center gap-2 truncate">
            <span className="text-lg leading-none">{selected.flag}</span>
            <span className="text-slate-800 font-medium">{selected.label}</span>
          </span>
        ) : (
          <span className="text-slate-400">Select country</span>
        )}
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div
          className="absolute z-50 left-0 right-0 bottom-full mb-1 bg-white rounded-2xl overflow-hidden min-w-[15rem]"
          style={{
            boxShadow:
              "0px 8px 32px rgba(0,0,128,0.10), 0px 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div className="p-3 pb-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all",
                "border-[#1D6FF2] ring-2 ring-[#1D6FF2]/20 bg-white",
              )}
            >
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-64 px-2 pb-3">
            {!search && (
              <>
                <p className="text-xs text-slate-400 font-medium px-3 pt-1 pb-2">
                  Popular
                </p>
                {popularCountries.map((c) => (
                  <CountryOption
                    key={c.code}
                    country={c}
                    selected={value === c.code}
                    onSelect={handleSelect}
                  />
                ))}
                <div className="my-2 border-t border-slate-100" />
              </>
            )}

            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <CountryOption
                  key={c.code}
                  country={c}
                  selected={value === c.code}
                  onSelect={handleSelect}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                No countries found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const POPULAR_CODES = ["GB", "US", "CA", "AU", "DE", "IN"];

function CountryOption({
  country,
  selected,
  onSelect,
}: {
  country: { code: string; label: string; flag: string };
  selected: boolean;
  onSelect: (code: string, label: string) => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={() => onSelect(country.code, country.label)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
        selected
          ? "bg-blue-50 text-[#1D6FF2]"
          : "hover:bg-slate-50 text-slate-800",
      )}
    >
      <span className="text-xl leading-none w-7 flex-shrink-0">
        {country.flag}
      </span>
      <span className="text-sm font-medium">{country.label}</span>
    </button>
  );
}
