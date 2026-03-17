// "use client";

// import bgImg from "@/assets/Testimonials.png";
// import { Card } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import LoadingSpinner from "@/lib/loading-spinner";
// import { TestimonialT } from "@/lib/Types";
// import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";
// import { CircleUserRound, Quote } from "lucide-react";

// export function TestimonialCarousel() {
//   const { data, isLoading } = useGetAllReviewsQuery(undefined);
//   const reviews = data?.data?.reviews;

//   return (
//     <section className="relative bg-[#001328] py-20">
//       <div className="container mx-auto px-4 text-center">
//         <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">
//           What our customers say
//         </h2>
//         <p className="mmd:text-xl leading-relaxed text-white">
//           Join thousands of satisfied users who trust TravelJack
//         </p>

//         {isLoading ? (
//           <LoadingSpinner />
//         ) : (
//           <Carousel className="mx-auto mt-14 max-w-6xl">
//             <CarouselContent>
//               {reviews?.map((item: TestimonialT) => (
//                 <CarouselItem
//                   key={item?._id}
//                   className="basis-1/2 lg:basis-1/3"
//                 >
//                   <div className="md:p-4">
//                     <Card
//                       className="p-3 md:p-6 bg-transparent border border-white/20 h-96 flex items-start justify-center gap-2 md:gap-5"
//                       style={{
//                         backgroundImage: `url(${bgImg.src})`,
//                         backgroundPosition: "center",
//                         backgroundRepeat: "no-repeat",
//                         boxShadow:
//                           "0 0 30px rgba(43,127,255,0.2), 0 0 10px rgba(0,184,219,0.2)",
//                       }}
//                     >
//                       {/* Quote Icon */}
//                       <Quote className="h-14 w-14 text-[#51A2FF80]/50 " />

//                       {/* Stars */}
//                       <div className="mb-4 flex gap-1 text-yellow-400">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <span key={i}>★</span>
//                         ))}
//                       </div>

//                       {/* Text */}
//                       <p className="text-start leading-relaxed text-white/90">
//                         “{item.comment}”
//                       </p>

//                       {/* Footer */}
//                       <div className="mt-6 flex items-center gap-2 text-lg text-slate-400">
//                         <CircleUserRound className="size-6" />
//                         {item.name}
//                       </div>
//                     </Card>
//                   </div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>

//             {/* Mobile bottom arrows */}
//             <div className="flex xl:hidden justify-center gap-4 mt-10">
//               <CarouselPrevious className="static bg-primary text-white border-none hover:bg-secondary" />
//               <CarouselNext className="static bg-primary text-white border-none hover:bg-secondary" />
//             </div>

//             {/* Desktop side arrows */}
//             <div className="hidden xl:block">
//               <CarouselPrevious className="bg-primary text-white border-none hover:bg-secondary" />
//               <CarouselNext className="bg-primary text-white border-none hover:bg-secondary" />
//             </div>
//           </Carousel>
//         )}
//       </div>
//     </section>
//   );
// }
"use client";

import { motion, type Variants } from "framer-motion";
import { useGetReviewsQuery } from "@/redux/features/review/reviewApi";
import LoadingSpinner from "@/lib/loading-spinner";
import { TestimonialT } from "@/lib/Types";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const avatarBgColors = [
  "bg-rose-200",
  "bg-amber-200",
  "bg-slate-300",
  "bg-blue-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-teal-200",
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={i < rating ? "#FBBF24" : "#FDE68A"}
        stroke={i < rating ? "#F59E0B" : "#FCD34D"}
        strokeWidth="1"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const Avatar = ({ initials, bg }: { initials: string; bg: string }) => (
  <div
    className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center text-slate-700 font-bold text-[14px] shrink-0`}
  >
    {initials}
  </div>
);

const TestimonialCard = ({
  testimonial,
  index,
  dimmed = false,
}: {
  testimonial: TestimonialT;
  index: number;
  dimmed?: boolean;
}) => {
  const initials = getInitials(testimonial.name);
  const avatarBg = avatarBgColors[index % avatarBgColors.length];

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
      className={`
        relative shrink-0 w-[460px] max-md:w-full
        bg-white rounded-2xl p-7 border border-slate-100 shadow-sm
        flex flex-col gap-5 transition-opacity duration-300
        ${dimmed ? "opacity-40 pointer-events-none select-none" : "opacity-100"}
      `}
    >
      <div className="text-blue-300 text-[40px] leading-none font-serif select-none">
        &ldquo;&rdquo;
      </div>

      <StarRating rating={testimonial.rating ?? 5} />

      <p className="text-[15px] text-slate-600 leading-relaxed flex-1 italic">
        &ldquo;{testimonial.comment}&rdquo;
      </p>

      <div className="h-px bg-slate-100" />

      <div className="flex items-center gap-3">
        <Avatar initials={initials} bg={avatarBg} />
        <div>
          <p className="text-[15px] font-bold text-[#0d1b8e]">
            {testimonial.name}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  const { data, isLoading } = useGetReviewsQuery({});
  const reviews: TestimonialT[] = data?.data?.reviews ?? [];

  return (
    <section className="w-full bg-[#F6FAFF] overflow-hidden">
      <div className="max-w-[1442px] mx-auto py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-[52px] max-md:gap-8"
        >
          <div className="flex flex-col items-center gap-3 text-center px-[137px] max-md:px-4">
            <motion.h2
              variants={fadeUpVariants}
              className="text-[40px] max-md:text-[34px] font-bold text-[#0d1b8e] leading-tight tracking-tight"
            >
              Trusted by guests &amp; hotels
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-[16px] text-slate-400 leading-relaxed"
            >
              Real stories from people who got their items back
            </motion.p>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="hidden md:block relative overflow-hidden">
                <div
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-[100px] z-10"
                  style={{
                    background:
                      "linear-gradient(to right, #F6FAFF 30%, rgba(246,250,255,0.3) 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-[100px] z-10"
                  style={{
                    background:
                      "linear-gradient(to left, #F6FAFF 30%, rgba(246,250,255,0.3) 100%)",
                  }}
                />

                <div className="flex gap-5 w-max animate-marquee hover:paused">
                  {[...reviews, ...reviews].map((t, i) => (
                    <TestimonialCard
                      key={`${t._id}-${i}`}
                      testimonial={t}
                      index={i}
                      dimmed={false}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                variants={containerVariants}
                className="flex md:hidden flex-col gap-4 px-4"
              >
                {reviews.slice(0, 3).map((t, i) => (
                  <TestimonialCard
                    key={t._id}
                    testimonial={t}
                    index={i}
                    dimmed={false}
                  />
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
