"use client";

import { useParams } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SubscribeNewsletter from "@/components/blog/subscribe-newsletter";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params.slug;

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-blog-bg flex items-center justify-center">
        <p className="text-xl text-blog-heading font-medium">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-0 md:pt-44 md:pb-20"
      >
        <motion.div variants={itemVariants}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blog-link font-bold text-[14px] md:text-[15px] hover:text-blue-deep transition-colors mb-8 md:mb-12 w-fit"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> Back to Blog
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 md:mb-9">
          <span className="inline-block bg-blue-lightest text-blog-link px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-[12px] font-bold uppercase tracking-wider mb-4 md:mb-5">
            {post.category}
          </span>

          <h1 className="text-[28px] md:text-[44px] font-bold text-blog-heading leading-[1.2] mb-4 md:mb-5">
            {post.title}
          </h1>

          <p className="text-text-gray text-[12px] md:text-[15px] font-medium">
            {post.date} &nbsp;•&nbsp; {post.readTime}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="w-full relative rounded-2xl md:rounded-[32px] overflow-hidden mb-12 md:mb-16 shadow-sm"
        >
          <Image
            src={post.image}
            alt={post.title}
            className="w-full h-[300px] md:h-[472px] object-cover"
            priority
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="prose prose-lg max-w-none text-html-text prose-p:leading-relaxed prose-headings:text-blog-heading"
        >
          <h2 className="text-[22px] md:text-[28px] font-bold text-primary-new mb-4 md:mb-5">
            The Pre-Checkout Sweep
          </h2>

          <p className="mb-4 md:mb-5 text-[14px] md:text-base leading-[1.7] text-text-body">
            Checking out of a hotel can often feel like a rushed race against
            the clock. Between gathering your belongings, double-checking your
            itinerary, and ensuring you haven't forgotten anything, it's easy to
            overlook small items that hold significant value—both financial and
            sentimental.
          </p>

          <p className="mb-8 text-[14px] md:text-base leading-[1.7] text-text-body">
            A systematic approach to your final room sweep can save you hours of
            stress and the potential cost of replacing lost items. Here is our
            definitive checklist for a stress-free departure.
          </p>

          <div
            className={cn(
              "bg-blue-lightest rounded-xl md:rounded-[20px] p-3 px-2 md:p-8 my-8 md:my-12 relative border-l-4 border-l-active",
            )}
          >
            <p className="text-primary-new font-semibold text-sm md:text-base leading-[1.6] italic m-0">
              "According to industry statistics, over 35% of hotel guests leave
              at least one item behind during their stay. The most common items
              are chargers, jewelry, and small electronics."
            </p>
          </div>

          <div className="flex flex-col gap-10 md:gap-14 mt-12 md:mt-16">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <span className="flex items-center justify-center min-w-[32px] w-[32px] h-[32px] md:min-w-[40px] md:w-[40px] md:h-[40px] bg-active rounded-full text-white font-bold text-[15px] md:text-[18px]">
                  1
                </span>
                <h3 className="text-base md:text-[24px] font-bold text-primary-new m-0">
                  The Nightstand & Under the Bed
                </h3>
              </div>
              <p className="text-sm md:text-base text-text-body m-0 leading-[1.7]">
                This is the most frequent "loss zone." Phones, glasses, and
                books often find their way into the small gap between the
                nightstand and the bed. Before you zip your suitcase, get down
                on your knees and check underneath the bed frame with your
                phone's flashlight.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-blog-tag-border bg-blog-tag-bg text-blog-tag-text text-[12px] md:text-[13px] font-medium",
                  )}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 7L6 8.5L9.5 5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Check outlets for chargers
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-blog-tag-border bg-blog-tag-bg text-blog-tag-text text-[12px] md:text-[13px] font-medium",
                  )}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 7L6 8.5L9.5 5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Look inside the drawer
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <span className="flex items-center justify-center min-w-[32px] w-[32px] h-[32px] md:min-w-[40px] md:w-[40px] md:h-[40px] bg-active rounded-full text-white font-bold text-[15px] md:text-[18px]">
                  2
                </span>
                <h3 className="text-base md:text-[24px] font-bold text-primary-new m-0">
                  The Bathroom Mirror & Shower
                </h3>
              </div>
              <p className="text-sm md:text-base text-text-body m-0 leading-[1.7]">
                Toiletries are easily forgotten, but so are rings or watches
                placed on the ledge of the sink while washing up. Check the
                shower floor for razors or loofahs, and ensure you haven't left
                any prescriptions behind in the medicine cabinet or on the
                counter.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 mb-2">
                <span className="flex items-center justify-center min-w-[32px] w-[32px] h-[32px] md:min-w-[40px] md:w-[40px] md:h-[40px] bg-active rounded-full text-white font-bold text-[15px] md:text-[18px]">
                  3
                </span>
                <h3 className="text-base md:text-[24px] font-bold text-primary-new m-0">
                  The Closet & Safe
                </h3>
              </div>
              <p className="text-sm md:text-base text-text-body m-0 leading-[1.7]">
                Don't forget the items you "hid" for safekeeping. Check the
                closet for hanging clothes and especially the hotel safe. A
                common traveler's tip is to put one of your shoes in the
                safe—you won't be able to leave the room with only one shoe,
                forcing you to open the safe before you go.
              </p>
            </div>
          </div>

          <div
            className={cn(
              "bg-secondary rounded-2xl md:rounded-[24px] p-6 md:p-8 mt-12 md:mt-16",
            )}
          >
            <h3 className="text-[18px] md:text-[22px] font-bold text-primary-new mb-3 md:mb-4 m-0">
              What If You Forget Something?
            </h3>
            <p className="text-[14px] md:text-[15px] text-text-body leading-[1.6] mb-5 md:mb-6 m-0">
              Even with the best preparation, accidents happen. If you realize
              you've left an item behind after you've already reached the
              airport or your next destination, don't panic.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-active font-bold text-[14px] md:text-[15px] hover:text-blue-deep transition-colors m-0"
            >
              Use our automated Lost & Found tracker{" "}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </motion.main>

      <section className=" py-16 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-7xl mx-auto px-4 md:px-8"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-[28px] font-bold text-blog-heading mb-8 md:mb-12"
          >
            Related Articles
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 3)
              .map((relatedPost) => (
                <motion.div
                  variants={itemVariants}
                  key={relatedPost.id}
                  className={cn(
                    "bg-white border border-border-soft-blue rounded-2xl flex flex-col transition-all duration-300",
                    "hover:-translate-y-1",
                  )}
                >
                  <div className="p-3 md:p-4 pb-0">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-[200px] md:h-[240px] rounded-xl object-cover"
                    />
                  </div>

                  <div className="p-4 xs:p-5 md:p-6 flex flex-col grow">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="bg-blue-lightest text-blog-link px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                        {relatedPost.category}
                      </span>
                      <span className="text-text-gray text-[10px] sm:text-[11px] font-medium">
                        {relatedPost.date} • {relatedPost.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-[20px] font-bold text-blog-heading leading-[1.3] mb-3">
                      {relatedPost.title}
                    </h3>

                    <p className="text-sm text-text-gray leading-[1.6] mb-5 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>

                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="inline-flex items-center gap-2 text-blog-link font-bold text-[14px] hover:text-blue-deep transition-colors mt-auto w-fit"
                    >
                      Read More{" "}
                      <ArrowLeft className="w-4 h-4 md:w-[18px] md:h-[18px] rotate-180" />
                    </Link>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
