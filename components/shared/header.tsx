"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard, User, Headset } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/redux/features/user/userApi";
import { usePathname } from "next/navigation";

/* ================= MOBILE NAV LINKS ================= */
const MOBILE_NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Help Center", href: "/contact" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  /* ================= AUTH STATE ================= */
  const isAuthenticated = useSelector((state: any) => state.auth?.accessToken);

  /* ================= USER QUERY ================= */
  const { data, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = isAuthenticated ? data?.data : null;

  /* ================= HELPERS ================= */
  const getInitials = () => {
    if (!user?.firstName && !user?.lastName) return "U";
    return `${user?.firstName?.[0] ?? ""}${
      user?.lastName?.[0] ?? ""
    }`.toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  /* ================= CONDITIONAL LOGIC ================= */
  const isOrdersPage = pathname.startsWith("/orders");

  return (
    <div className="fixed top-8 px-4 w-full z-50">
      {/* ================= HEADER BAR ================= */}
      <div
        className="max-w-7xl mx-auto px-7 py-1 flex items-center justify-between rounded-full border-2 border-white"
        style={{
          boxShadow: "0px 30px 70px rgba(0, 150, 255, 0.2)",
          background:
            "linear-gradient(to right, #ffffff 0%, #ffffff 70%, rgba(239, 246, 255, 0.5) 100%)",
        }}
      >
        {/* ================= LOGO ================= */}
        <Link href="/" className="flex-1">
          <Image
            src={require("@/assets/logo.png")}
            alt="SendUBack logo"
            width={500}
            height={500}
            className="w-[190px] h-auto"
          />
        </Link>

        <div className="flex items-center gap-2">
          {/* ================= DESKTOP AUTH ================= */}
          <div className="flex-1 hidden lg:flex items-center justify-end gap-5">
            {/* Show Help button on orders page regardless of auth status */}
            {isOrdersPage ? (
              <Link
                href="/contact"
                target="_blank"
                className="text-xl font-bold text-primary border border-primary rounded-full p-1 px-4 flex items-center justify-center gap-2"
              >
                Help
                <Headset />
              </Link>
            ) : (
              <div className="hidden lg:flex items-center justify-end gap-5">
                {!isAuthenticated && !isLoading ? (
                  <>
                    <Link
                      href="/signin"
                      className="transparent-btn border border-primary px-5 py-3 rounded-2xl text-primary hover:bg-primary hover:text-white font-medium transition"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/signup"
                      className="font-semibold px-5 py-3 rounded-2xl regular-btn text-white"
                    >
                      Register Business
                    </Link>
                  </>
                ) : null}
              </div>
            )}

            {/* For orders page - only show auth buttons when NOT authenticated */}
            {/* {isOrdersPage ? (
              // On orders page: show auth buttons only when user is NOT authenticated
              !isAuthenticated && !isLoading ? (
                <>
                  <Link
                    href="/login"
                    className="transparent-btn border border-primary px-5 py-3 rounded-2xl text-primary hover:bg-primary hover:text-white font-medium transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="font-semibold px-5 py-3 rounded-2xl regular-btn text-white"
                  >
                    Register Business
                  </Link>
                </>
              ) : null
            ) : // For other pages - show auth buttons normally
            !isAuthenticated && !isLoading ? (
              <>
                <Link
                  href="/login"
                  className="transparent-btn border border-primary px-5 py-3 rounded-2xl text-primary hover:bg-primary hover:text-white font-medium transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="font-semibold px-5 py-3 rounded-2xl regular-btn text-white"
                >
                  Register Business
                </Link>
              </>
            ) : null} */}

            {/* Show user dropdown when authenticated */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer">
                    {/* AVATAR */}
                    {user?.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASEURL}${user.image}`}
                        className="h-10 w-10 rounded-full object-cover border"
                        alt="User Avatar"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white font-bold">
                          {getInitials()}
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* ================= MOBILE HAMBURGER ================= */}
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <div className="w-8 h-7 flex flex-col justify-between">
                <span className="w-full h-1 bg-primary" />
                <span className="w-full h-1 bg-primary" />
                <span className="w-full h-1 bg-primary" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* ================= OVERLAY ================= */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= MOBILE SLIDE MENU ================= */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          boxShadow: "0px 30px 70px rgba(0, 150, 255, 0.25)",
        }}
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {user?.image ? (
                    <div className="relative h-12 w-12">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASEURL}${user.image}`}
                        alt="User Avatar"
                        fill
                        sizes="48px"
                        className="rounded-full object-cover border"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div className="leading-tight">
                    <p className="font-semibold text-sm">
                      {user?.firstName || "Guest User"}
                    </p>
                    <p className="text-xs capitalize">
                      {user?.role || "Business"}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="text-lg font-semibold text-gray-800 hover:text-primary transition"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link href="/" className="flex-1">
                <Image
                  src={require("@/assets/logo.png")}
                  alt="SendUBack logo"
                  width={500}
                  height={500}
                  className="w-48 h-full"
                />
              </Link>
            )}
          </div>

          {MOBILE_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-semibold text-gray-800 hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t pt-6 space-y-4">
            {/* For orders page mobile menu - only show auth buttons when NOT authenticated */}
            {isOrdersPage ? (
              !isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="transparent-btn border font-semibold w-full px-5 py-3 border-primary text-primary"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="regular-btn w-full font-semibold text-center text-white"
                  >
                    Register Business
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600"
                >
                  Logout
                </Button>
              )
            ) : // For other pages - show auth buttons normally
            !isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="transparent-btn border font-semibold w-full px-5 py-3 border-primary text-primary"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="regular-btn w-full font-semibold text-center text-white"
                >
                  Register Business
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
