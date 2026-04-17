import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,1),transparent_60%)]" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="mb-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Ready to Get Your Items Back?
        </h2>

        <p className="mb-10 text-lg text-slate-400">
          Whether you call us Send You Back, Send U Back, or SendUBack —
          we&apos;re here to help.
        </p>

        <Link
          href="https://senduback.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-10 py-3 text-base font-semibold text-white shadow-lg",
            "bg-blue-500 hover:bg-blue-600 hover:shadow-xl transition-all",
          )}
        >
          Go to senduback.com
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
