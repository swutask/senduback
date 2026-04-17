"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    body: "I left my laptop charger at a hotel in Barcelona. I searched for 'send me back my stuff' and found SendUBack. Within a week, my charger was at my door. Incredible service!",
    author: "Sarah M.",
    hotel: "Guest at Hotel Arts, Barcelona",
  },
  {
    body: "Send You Back made it so easy to recover the watch I forgot at my hotel in London. The tracking was seamless and the team was responsive. Highly recommend Send U Back!",
    author: "James T.",
    hotel: "Guest at The Savoy, London",
  },
  {
    body: "I was panicking after leaving my passport at a hotel in Tokyo. SendUBack coordinated everything — the hotel found it and shipped it to me in 5 days. Lifesaver!",
    author: "Priya K.",
    hotel: "Guest at Park Hyatt, Tokyo",
  },
];

function StarRating() {
  return (
    <div className="mb-4 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-blue-500">
          Guest Stories
        </p>

        <h2 className="mb-14 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
          What Our Guests Say About{" "}
          <span className="text-blue-500">Send You Back</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map(({ body, author, hotel }, i) => (
            <motion.div
              key={author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn(
                "rounded-2xl border border-gray-200 bg-white p-7",
                "flex flex-col shadow-sm",
                "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
              )}
            >
              <StarRating />

              <p className="flex-1 text-sm leading-relaxed text-gray-700">
                “{body}”
              </p>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-900">{author}</p>
                <p className="text-xs text-gray-500">{hotel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
