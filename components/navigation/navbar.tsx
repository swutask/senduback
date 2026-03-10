"use client";

import { useState, useRef, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMenuData, MenuKey } from "./helper/menu";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "@/redux/features/user/userApi";
import { logout } from "@/redux/features/auth/authSlice";
import logo from "@/assets/logo.svg";
import {
  Headphones,
  User,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { AccordionNavItem, Menu } from "./menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const supportRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: any) => state.auth?.accessToken);

  const { data } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = isAuthenticated ? data?.data : null;

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

  const NavItem = ({
    label,
    menuKey,
    href = "#",
  }: {
    label: string;
    menuKey: MenuKey;
    href?: string;
  }) => {
    const handleEnter = () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      setOpenMenu(menuKey);
    };

    const handleLeave = () => {
      closeTimeout.current = setTimeout(() => {
        setOpenMenu(null);
      }, 180);
    };

    const isActive = openMenu === menuKey;

    return (
      <div
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <Link
          href={href}
          className={cn(
            "text-primary-new font-semibold flex items-center gap-1",
            isActive && "text-active",
          )}
        >
          {label}
          <span className="text-xs">▼</span>
        </Link>

        <Menu
          value={openMenu === menuKey ? menuKey : null}
          menuKey={menuKey!}
          layout={
            menuKey === "legal" || menuKey === "help" ? "simple" : "twoColumn"
          }
          columns={getMenuData(menuKey)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        />
      </div>
    );
  };

  const isOrdersPage = pathname.includes("/orders");

  const supportItems = [
    {
      icon: <MessageCircle className="w-5 h-5 text-green-500" />,
      iconBg: "bg-green-50",
      label: "WhatsApp Chat",
      sub: "Fastest response",
      href: "https://wa.me/447883156028",
    },
    {
      icon: <Phone className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-50",
      label: "Call Us",
      sub: "+44 151 404 9969",
      href: "tel:+441514049969",
    },
    {
      icon: <Mail className="w-5 h-5 text-primary-new" />,
      iconBg: "bg-[#e5e5f2]",
      label: "Email Support",
      sub: "support@senduback.com",
      href: "mailto:support@senduback.com",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-slate-400" />,
      iconBg: "bg-slate-100",
      label: "Help Center",
      sub: "FAQs & guides",
      href: "/contact",
    },
  ];

  return (
    <>
      <div className="fixed top-[1rem] md:top-8 w-full z-50 flex justify-center px-4">
        <div
          className="w-full max-w-[1170px] h-20 flex items-center justify-between
                    rounded-[12px] px-6 md:px-12 py-4 bg-white/95 backdrop-blur-lg relative"
          style={{
            boxShadow: "0px 4px 12px 0px #00008008, 0px 1px 3px 0px #0000800A",
          }}
        >
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="SendUBack logo"
              width={122}
              height={40}
              className="object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavItem label="For Guests" menuKey="guests" href="/for-guests" />
            <NavItem label="For Hotels" menuKey="hotels" href="/for-hotels" />
            <NavItem label="Help" menuKey="help" />
            <NavItem label="Legal" menuKey="legal" />
          </div>

          {isOrdersPage ? (
            <div className={cn("flex items-center gap-5")} ref={supportRef}>
              <div className="relative">
                <button
                  onClick={() => setIsSupportOpen((v) => !v)}
                  className="px-5 py-2 bg-[#0091ff] text-white text-xs rounded-full flex flex-row justify-center items-center gap-2 font-bold transition hover:bg-[#007de0]"
                >
                  <Headphones className="w-4 h-4" />
                  Help
                </button>

                {isSupportOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSupportOpen(false)}
                    />

                    <div
                      className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 bg-white rounded-2xl py-5 px-4"
                      style={{
                        boxShadow:
                          "0px 8px 32px rgba(0,0,128,0.12), 0px 2px 8px rgba(0,0,128,0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                          Get Support
                        </span>
                        <button
                          onClick={() => setIsSupportOpen(false)}
                          className="text-slate-400 hover:text-slate-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-1">
                        {supportItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsSupportOpen(false)}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 rounded-xl transition",
                              "hover:bg-slate-50",
                            )}
                          >
                            <span
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                item.iconBg,
                              )}
                            >
                              {item.icon}
                            </span>
                            <div className="leading-tight">
                              <p className="text-sm font-semibold text-primary-new">
                                {item.label}
                              </p>
                              <p className="text-xs text-slate-500">
                                {item.sub}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-5">
              {user ? (
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
                        <div className="h-10 w-10 rounded-full bg-primary-new flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {getInitials()}
                          </span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-48 bg-white p-3 rounded-xl">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2"
                      >
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
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="px-5 py-2.5 rounded-xl text-primary-new font-semibold transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className={cn(
                      "font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition",
                      "bg-[linear-gradient(110.24deg,#0099FF_0%,#000080_100%)] text-white",
                      "h-10 rounded-xl pt-2 pr-4 pb-2 pl-4 opacity-100",
                    )}
                  >
                    Register Business
                  </Link>
                </>
              )}
            </div>
          )}

          {!isOrdersPage && (
            <div className="flex lg:hidden items-center justify-end">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <div className="w-8 h-7 flex flex-col justify-between">
                  <span className="w-full h-1 bg-primary-new" />
                  <span className="w-full h-1 bg-primary-new" />
                  <span className="w-full h-1 bg-primary-new" />
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>

      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </>
  );
}

export function MobileMenu({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: any) => state.auth?.accessToken);

  const { data } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = isAuthenticated ? data?.data : null;

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  const close = () => setIsMobileMenuOpen(false);

  const accordionNavItems: {
    label: string;
    menuKey: MenuKey;
    href?: string;
  }[] = [
    { label: "For Guests", menuKey: "guests", href: "/for-guests" },
    { label: "For Hotels", menuKey: "hotels", href: "/for-hotels" },
    { label: "Help", menuKey: "help" },
    { label: "Legal", menuKey: "legal" },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={close} />
      )}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          boxShadow: "0px 30px 70px rgba(0, 150, 255, 0.25)",
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          {user ? (
            <div className="flex items-center gap-3">
              {user?.image ? (
                <div className="relative h-10 w-10">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASEURL}${user.image}`}
                    alt="User Avatar"
                    fill
                    sizes="40px"
                    className="rounded-full object-cover border"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary-new flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="leading-tight">
                <p className="font-semibold text-sm">
                  {user?.firstName || "Guest User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role || "Business"}
                </p>
              </div>
            </div>
          ) : (
            <Link href="/" onClick={close}>
              <Image
                src={logo}
                alt="SendUBack logo"
                width={110}
                height={36}
                className="object-contain"
              />
            </Link>
          )}

          <button
            onClick={close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="mb-2">
            {accordionNavItems.map((item) => (
              <AccordionNavItem
                key={item.menuKey}
                label={item.label}
                menuKey={item.menuKey}
                href={item.href}
                onClose={close}
              />
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/signin"
                onClick={close}
                className={cn(
                  "font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition",
                  "bg-transparent text-primary-new border border-primary-new",
                  "h-10 rounded-xl pt-2 pr-4 pb-2 pl-4 opacity-100 text-center",
                )}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={cn(
                  "font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition",
                  "bg-[linear-gradient(110.24deg,#0099FF_0%,#000080_100%)] text-white",
                  "h-10 rounded-xl pt-2 pr-4 pb-2 pl-4 opacity-100 text-center",
                )}
                onClick={close}
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
    </>
  );
}
