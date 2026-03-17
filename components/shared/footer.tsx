// "use client";

// import {
//   Clock,
//   Facebook,
//   Instagram,
//   Linkedin,
//   Mail,
//   MapPin,
//   Phone,
//   PhoneCall,
//   Twitter,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-[#001328] px-4 text-white pt-16 pb-8">
//       <div className="max-w-7xl mx-auto px-4 lg:px-0">
//         {/* Main Footer Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
//           {/* Brand Section */}
//           <div className="md:col-span-2">
//             <div className="mb-4">
//               <Link href={"/"}>
//                 <Image
//                   src={require("@/assets/logo-white.png")}
//                   alt="SendUBack logo"
//                   width={500}
//                   height={500}
//                   className="w-56 h-full "
//                 />
//               </Link>
//             </div>
//             <p className="text-white leading-relaxed">
//               Smart lost & found shipping for hotels, serviced <br />{" "}
//               apartments, and businesses.
//             </p>

//             <div className="space-y-2 mt-4 text-sm text-white">
//               {/* Phone */}
//               <Link
//                 href="tel:+441514049969"
//                 className="flex items-center gap-2 hover:underline"
//               >
//                 <Phone size={16} />
//                 <span>+44 151 404 9969</span>
//               </Link>

//               {/* Email */}
//               <Link
//                 href="mailto:support@senduback.com"
//                 className="flex items-center gap-2 hover:underline"
//               >
//                 <Mail size={16} />
//                 <span>support@senduback.com</span>
//               </Link>

//               {/* Business Hours */}
//               <p className="flex items-center gap-2">
//                 <Clock size={16} />
//                 <span>Monday – Friday 6 am to 8 pm GMT</span>
//               </p>

//               {/* Address */}
//               <p className="flex items-start gap-2">
//                 <MapPin size={16} className="mt-0.5" />
//                 <span>
//                   344 Stanley Road, Bootle, Liverpool,
//                   <br />
//                   L20 3EX, United Kingdom
//                 </span>
//               </p>

//               {/* social media */}
//               <div className="flex items-center gap-4 mt-6">
//                 <Link
//                   href={"https://www.linkedin.com/company/senduback"}
//                   target="_blank"
//                 >
//                   <Linkedin className="size-5 shrink-0 " />
//                 </Link>
//                 <Link
//                   href={"https://www.instagram.com/sendubackltd"}
//                   target="_blank"
//                 >
//                   <Instagram className="size-5 shrink-0 " />
//                 </Link>
//                 <Link
//                   href={
//                     "https://www.facebook.com/profile.php?id=61583474044479"
//                   }
//                   target="_blank"
//                 >
//                   <Facebook className="size-5 shrink-0 " />
//                 </Link>
//               </div>
//               {/* <div className="">
//                 <Image
//                   src={require("@/assets/Stripe-logo.png")}
//                   alt=""
//                   width={400}
//                   height={400}
//                   className="-ml-5"
//                 />
//               </div> */}
//             </div>
//           </div>

//           {/* Column 2 - Guests */}
//           <div className="md:pt-[75px]">
//             <h3 className="font-semibold text-lg mb-4">Guests</h3>
//             <ul className="space-y-3">
//               <li>
//                 <Link
//                   href="/#found"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Get my item back
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Track my order
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/#guests"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   How it works
//                 </Link>
//               </li>
//             </ul>
//             {/* <div className="mt-6">
//               <Image
//                 src={require("@/assets/ICO_Logo_White.png")}
//                 alt="ICO Logo"
//                 width={200}
//                 height={200}
//                 className="w-36 h-auto"
//               />
//             </div> */}
//           </div>

//           {/* Column 3 - Resources */}
//           <div className="md:pt-[75px]">
//             <h3 className="font-semibold text-lg mb-4">Hotels</h3>
//             <ul className="space-y-3">
//               <li>
//                 <Link
//                   href={"/register"}
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Register your business
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/dashboard"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Business dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/#found"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Book a demo
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3 - Resources */}
//           <div className="md:pt-[75px]">
//             <h3 className="font-semibold text-lg mb-4">Resources</h3>
//             <ul className="space-y-3">
//               <li>
//                 <Link
//                   href={"/faq "}
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   FAQ
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/contact"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Help Center
//                 </Link>
//               </li>
//               {/* <li>
//                 <Link
//                   href="/"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Insurance information
//                 </Link>
//               </li> */}
//             </ul>
//           </div>

//           {/* Column 4 - Legal */}
//           <div className="md:pt-[75px]">
//             <h3 className="font-semibold text-lg mb-4">Legal</h3>
//             <ul className="space-y-3">
//               <li>
//                 <Link
//                   href="/privacy-policy"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/refund-policy"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Refund Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/terms-conditions"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Terms
//                 </Link>
//               </li>
//               {/* <li>
//                 <Link
//                   href="/#"
//                   className="text-white hover:text-white transition-colors"
//                 >
//                   Cookie Setting
//                 </Link>
//               </li> */}
//             </ul>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
//           <div className="">
//             <Image
//               src={require("@/assets/Stripe-logo.png")}
//               alt=""
//               width={400}
//               height={400}
//               className=""
//             />
//           </div>
//           <div className="">
//             <Image
//               src={require("@/assets/ICO_Logo_White.png")}
//               alt="ICO Logo"
//               width={200}
//               height={200}
//               className="w-36 h-auto"
//             />
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-[#1D293D] my-8"></div>

//         {/* Copyright */}
//         <div className="text-center">
//           <p className="text-gray-400 text-sm">
//             © {currentYear} SendUBack Ltd. All rights reserved.
//           </p>
//           <p className="text-gray-200 text-sm">
//             Registered in England & Wales – Company No. 16810450
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }

"use client";

import { motion, type Variants } from "framer-motion";
import * as Separator from "@radix-ui/react-separator";
import { ICONS } from "@/assets";
import Image from "next/image";

const navLinks = {
  product: [
    { label: "How it Works", href: "/#guests" },
    { label: "For Guests", href: "/for-guests" },
    { label: "For Hotels", href: "/for-hotels" },
    { label: "Pricing", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Track Your Order", href: "/" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "#" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "#" },
  ],
};

const contactInfo = [
  {
    icon: ICONS["footerPhone"],
    text: "+44 151 404 9969",
    href: "tel:+441514049969",
  },
  {
    icon: ICONS["footerMail"],
    text: "support@senduback.com",
    href: "mailto:support@senduback.com",
  },
  { icon: ICONS["footerTime"], text: "Mon–Fri, 6 am – 8 pm GMT", href: null },
  {
    icon: ICONS["footerMap"],
    text: "344 Stanley Road, Bootle, Liverpool, L20 3EX, United Kingdom",
    href: null,
  },
];

const socialLinks = [
  {
    icon: ICONS["linkedIn"],
    href: "https://www.linkedin.com/company/senduback",
    label: "LinkedIn",
  },
  { icon: ICONS["x"], href: "#", label: "X (Twitter)" },
  {
    icon: ICONS["insta"],
    href: "https://www.instagram.com/sendubackltd",
    label: "Instagram",
  },
];

const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white mb-4">
    {children}
  </h3>
);

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <a
      href={href}
      className="text-[14px] text-slate-300/80 hover:text-white transition-colors duration-200 leading-relaxed"
    >
      {children}
    </a>
  </li>
);

const SocialButton = ({
  icon,
  href,
  label,
}: {
  icon: string;
  href: string;
  label: string;
}) => (
  <motion.a
    href={href}
    aria-label={label}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-colors duration-200"
  >
    <Image src={icon} alt="Shield Icon" width={36} height={36} />
  </motion.a>
);

const TrustBadge = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-600/50 bg-slate-800/40 text-slate-300 text-[13px] font-medium">
    {children}
  </div>
);

export default function Footer() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <footer className="bg-[#0d1b35] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr] gap-10 lg:gap-8"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image
                src={ICONS["footerLogo"]}
                alt="SendUBack Logo"
                width={130}
                height={40}
                priority
              />
            </div>
            <p className="text-[14px] text-slate-400 leading-relaxed max-w-60">
              The trusted way to get your lost items back from hotels worldwide.
              Fast, secure, and fully insured.
            </p>
            <div className="flex items-center gap-2.5 mt-1">
              {socialLinks.map((s) => (
                <SocialButton key={s.label} {...s} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterHeading>Product</FooterHeading>
            <ul className="space-y-2.5">
              {navLinks.product.map((l) => (
                <FooterLink key={l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterHeading>Support</FooterHeading>
            <ul className="space-y-2.5">
              {navLinks.support.map((l) => (
                <FooterLink key={l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterHeading>Company</FooterHeading>
            <ul className="space-y-2.5">
              {navLinks.company.map((l) => (
                <FooterLink key={l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </ul>

            <div className="mt-8">
              <FooterHeading>Legal</FooterHeading>
              <ul className="space-y-2.5">
                {navLinks.legal.map((l) => (
                  <FooterLink key={l.label} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FooterHeading>Get in Touch</FooterHeading>
            <ul className="space-y-4">
              {contactInfo.map(({ icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="flex items-center justify-center text-slate-400 mt-0.5 shrink-0">
                    <Image
                      src={icon}
                      alt="footer_icon"
                      width={32}
                      height={32}
                    />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="text-[13.5px] text-slate-300/80 hover:text-white transition-colors duration-200 leading-snug"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-[13.5px] text-slate-300/80 leading-snug">
                      {text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-12"
        >
          <TrustBadge>
            <Image src={ICONS["stripe"]} alt="stripe" width={40} height={20} />
            <span className="text-slate-400 font-normal text-[12px]">
              Powered by Stripe
            </span>
          </TrustBadge>
          <TrustBadge>
            <Image src={ICONS["ico"]} alt="ICO" width={40} height={20} />
            <span>ICO Registered</span>
          </TrustBadge>
          <TrustBadge>
            <Image
              src={ICONS["footerShield"]}
              alt="Shield Icon"
              width={16}
              height={16}
            />
            <span>256-bit SSL</span>
          </TrustBadge>
        </motion.div>

        <Separator.Root className="h-px bg-slate-700/50 mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-500">
          <span>© 2026 SendUBack. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {[
              { label: "Terms", href: "#" },
              { label: "Privacy", href: "#" },
              { label: "Cookies", href: "#" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="hover:text-slate-300 transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
