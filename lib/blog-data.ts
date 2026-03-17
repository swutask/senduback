import blogFeaturedImg from "@/assets/blog-featured-img.png";
import { StaticImageData } from "next/image";

export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: StaticImageData;
  isFeatured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "10-essential-travel-items",
    category: "HOTEL OPERATIONS",
    date: "June 2, 2026",
    readTime: "8 min read",
    title:
      "10 Essential Travel Items You're Most Likely to Leave Behind (and How to Recover Them)",
    excerpt:
      "From chargers to jewelry, we've analyzed over 10,000 lost item reports to help you keep your belongings safe on your next trip.",
    image: blogFeaturedImg,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "future-of-hospitality-tech",
    category: "HOTEL OPERATIONS",
    date: "June 2, 2026",
    readTime: "8 min read",
    title:
      "The Future of Hospitality: How Tech is Streamlining the Lost & Found Process",
    excerpt:
      "Learn how major hotel chains are reducing workload for housekeeping staff while improving guest satisfaction scores.",
    image: blogFeaturedImg,
    isFeatured: false,
  },
  {
    id: "3",
    slug: "efficient-hotel-operations",
    category: "HOTEL OPERATIONS",
    date: "June 25, 2026",
    readTime: "6 min read",
    title:
      "10 Proven Ways to Reduce the Operational Workload for Your Housekeeping Team",
    excerpt:
      "Optimizing the workflow around forgotten items and how hotel operations can quickly scale efficiency metrics.",
    image: blogFeaturedImg,
    isFeatured: false,
  },
  {
    id: "4",
    slug: "travel-tips-packing-hacks",
    category: "Travel Tips",
    date: "July 12, 2026",
    readTime: "5 min read",
    title: "The Ultimate Guide to Packing Light & Never Forgetting Essentials",
    excerpt:
      "Use these simple memory hacks and packing principles to ensure your passport and wallet make it back home.",
    image: blogFeaturedImg,
    isFeatured: false,
  },
  {
    id: "5",
    slug: "company-news-funding-round",
    category: "Company News",
    date: "August 5, 2026",
    readTime: "3 min read",
    title: "SendUBack Secures $10M Series A Funding to Expand Globally",
    excerpt:
      "We are thrilled to announce our latest funding milestone, enabling us to bring seamless lost & found recovery to 50+ new countries.",
    image: blogFeaturedImg,
    isFeatured: false,
  },
  {
    id: "6",
    slug: "guest-stories-recovering-heirlooms",
    category: "Guest Stories",
    date: "September 18, 2026",
    readTime: "7 min read",
    title: "A Groom Reunited with His Grandfather's Wedding Ring Just in Time",
    excerpt:
      "Read the heart-warming story of how a frantic groom recovered a priceless heirloom left in an airport hotel safe.",
    image: blogFeaturedImg,
    isFeatured: false,
  },
  {
    id: "7",
    slug: "travel-tips-securing-electronics",
    category: "Travel Tips",
    date: "October 3, 2026",
    readTime: "4 min read",
    title: "How to Secure Your Electronics While Working Remotely From Hotels",
    excerpt:
      "Best practices for digital nomads trying to avoid leaving chargers, hard drives, and adapters scattered across their hotel rooms.",
    image: blogFeaturedImg,
    isFeatured: false,
  },
];
