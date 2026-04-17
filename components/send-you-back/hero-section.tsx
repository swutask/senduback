import Link from "next/link";
import { ChevronRight } from "lucide-react";

const BackgroundBlobs = () => {
  return (
    <>
      <div
        className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-30 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgb(59, 130, 246) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-40 -right-32 w-80 h-80 rounded-full opacity-20 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgb(56, 189, 248) 0%, transparent 70%)",
        }}
      />
    </>
  );
};

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgb(240, 247, 255) 0%, rgb(255, 255, 255) 100%)",
        }}
      />

      <BackgroundBlobs />

      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: "rgb(239, 246, 255)",
            color: "rgb(59, 130, 246)",
            border: "1px solid rgb(219, 234, 254)",
          }}
        >
          <ShieldIcon />
          Trusted by Hotels Worldwide
        </div>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
          style={{ color: "rgb(15, 23, 42)" }}
        >
          <span className="bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Send You Back
          </span>

          <br className="hidden md:block" />
          <span
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: "rgb(51, 65, 85)" }}
          >
            {" "}
            — The Smarter Way to Return Lost Items
          </span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-172 mx-auto mb-3 leading-relaxed"
          style={{ color: "rgb(71, 85, 105)" }}
        >
          Whether you know us as{" "}
          <strong style={{ color: "rgb(15, 23, 42)" }}>Send You Back</strong>,{" "}
          <strong style={{ color: "rgb(15, 23, 42)" }}>Send U Back</strong>, or{" "}
          <strong style={{ color: "rgb(15, 23, 42)" }}>SendUBack</strong> —
          we&apos;re the same trusted platform helping hotels return lost items
          to guests.
        </p>

        <p
          className="text-base max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgb(148, 163, 184)" }}
        >
          Left something at a hotel? Need a{" "}
          <strong style={{ color: "rgb(100, 116, 139)" }}>
            hotel lost and found return service
          </strong>
          ? Thinking &quot;
          <strong style={{ color: "rgb(100, 116, 139)" }}>
            send me back my stuff
          </strong>
          &quot;? We&apos;ve got you covered.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#found"
            className="inline-flex items-center justify-center gap-2 h-11 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
            style={{
              backgroundColor: "rgb(59, 130, 246)",
              color: "#fff",
            }}
          >
            Get My Item Back
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>

          <Link
            href="/for-hotels"
            className="inline-flex items-center justify-center gap-2 h-11 px-8 text-base font-semibold rounded-full border-2 transition-shadow hover:shadow-md"
            style={{
              borderColor: "rgb(59, 130, 246)",
              color: "rgb(59, 130, 246)",
              backgroundColor: "transparent",
            }}
          >
            For Hotels
          </Link>
        </div>
      </div>
    </section>
  );
}
