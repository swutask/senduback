import Link from "next/link";
import {
  BarChart2,
  Users,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: BarChart2,
    title: "Reduce Admin Overhead",
    description:
      "Automate your lost-and-found workflow. No more manual calls, emails, or shipping logistics for your front desk team.",
  },
  {
    icon: Users,
    title: "Boost Guest Satisfaction",
    description:
      "Turn a negative guest experience into a positive one. Returning lost items builds loyalty and drives 5-star reviews.",
  },
  {
    icon: LayoutDashboard,
    title: "Branded Hotel Portal",
    description:
      "Get a custom-branded lost-and-found portal for your hotel. Guests see your brand throughout the return process.",
  },
  {
    icon: ShieldCheck,
    title: "Free for Hotels",
    description:
      "SendUBack is completely free for hotel partners. No setup fees, no monthly costs — guests cover shipping when they request a return.",
  },
];

export default function ForHotelsSection() {
  return (
    <section id="for-hotels" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
            For Hotel Partners
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            The Best{" "}
            <span className="text-blue-500">Hotel Lost and Found Solution</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Streamline your{" "}
            <strong className="text-gray-600">
              hotel lost property management
            </strong>{" "}
            with SendUBack. Free to join, easy to use.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:gap-8">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className={cn(
                "flex gap-5 rounded-2xl border border-gray-200 bg-white p-8",
                "transition-all hover:shadow-lg",
              )}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/for-hotels"
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg",
              "bg-blue-500 hover:bg-blue-600 hover:shadow-xl transition-all",
            )}
          >
            Partner With SendUBack
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
