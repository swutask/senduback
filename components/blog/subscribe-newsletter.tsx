"use client";

import Image from "next/image";
import subscribeBg from "@/assets/subscribe-bg.png";
import { cn } from "@/lib/utils";

export default function SubscribeNewsletter() {
  return (
    <section className={cn("w-full bg-blog-bg pb-20")}>
      <div className="max-w-[1170px] mx-auto px-4 md:px-8">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-[24px] md:rounded-[32px]",
            "px-4 py-6 md:px-12 md:py-20 flex flex-col items-center justify-center text-center shadow-lg bg-blog-subscribe-bg",
          )}
          style={{
            backgroundImage: `url(${subscribeBg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-blog-subscribe-overlay mix-blend-multiply" />

          <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
            <h2 className="text-2xl md:text-[44px] font-bold text-white mb-6 leading-tight">
              Subscribe to our newsletter
            </h2>

            <p className="text-sm md:text-xl text-white mb-6 max-w-2xl">
              Get the latest travel tips and recovery stories delivered to your
              inbox.
            </p>

            <form
              className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className={cn(
                  "w-full h-12 md:h-14 px-6 max-w-[321px] rounded-xl bg-white",
                  "text-blog-heading placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-white/50 text-[15px] md:text-base border-none",
                )}
              />
              <button
                type="submit"
                className={cn(
                  "w-full sm:w-auto shrink-0 h-12 md:h-14 px-8 md:px-10 rounded-xl",
                  "bg-blog-heading text-white font-bold text-[15px] md:text-base transition-colors duration-200",
                )}
              >
                Subscribe
              </button>
            </form>

            <p className="text-[12px] text-[#BEDBFF]">
              We care about your data in our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
