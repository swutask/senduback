"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { menuItems, UserRole } from "@/config/menuConfig";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

export function AppSidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const role: UserRole = user?.role ?? "user";
  const items = menuItems[role];

  return (
    <Sidebar className="border-none! flex flex-col h-screen bg-green">
      <div
        className="flex flex-col h-full"
        style={{
          background:
            "linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #1E3A8A 100%)",
        }}
      >
        {/* Fixed Logo Section */}
        <div
          className="py-1.5 flex justify-center shrink-0"
          style={{
            background:
              "linear-gradient(180deg, #0F172A 0%, #1E3A8A 60%, #1E40AF 100%)",
          }}
        >
          <Link href="/">
            <Image
              src={require("@/assets/logo-white.png")}
              alt="Dashboard Logo"
              height={200}
              width={200}
              className="w-48 h-auto block"
            />
          </Link>
        </div>

        {/* Scrollable Menu */}
        <SidebarContent
          className="mt-8 flex-1 max-h-[800px] overflow-y-auto p-0 !scrollbar-thin !scrollbar-thumb-[#0096FF] !scrollbar-track-transparent"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#0096FF transparent",
          }}
        >
          <SidebarGroup className="p-0 pb-6 border-b border-white/20">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={`relative mx-3 px-5 py-2 transition-colors rounded-md ${
                      (
                        item.url === "/dashboard"
                          ? pathname === "/dashboard" ||
                            (pathname.startsWith("/dashboard/") &&
                              !items.some(
                                (i) =>
                                  i.url !== "/dashboard" &&
                                  pathname.startsWith(i.url),
                              ))
                          : pathname === item.url
                      )
                        ? "bg-[linear-gradient(180deg,rgba(0,148,252,0.80)_19.32%,rgba(1,106,207,0.80)_100%)] "
                        : "hover:bg-[linear-gradient(180deg,rgba(0,148,252,0.80)_19.32%,rgba(1,106,207,0.80)_100%)]"
                    }`}
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className="text-lg! flex items-center text-white gap-2.5 hover:text-white p-0! bg-transparent! !hover:bg-transparent focus-visible:shadow-none active:text-white"
                      >
                        <item.icon className="size-6!" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* LOGOUT BUTTON (NO DESIGN CHANGE) */}
        <div className="shrink-0 pb-6">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem className="relative mx-3 px-5 py-2 transition-colors rounded-md bg-red-500">
              <SidebarMenuButton
                onClick={() => dispatch(logout())}
                className="text-lg! flex items-center text-white hover:text-white gap-2.5 p-0! bg-transparent! focus-visible:shadow-none"
              >
                <LogOut className="size-6!" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </div>
    </Sidebar>
  );
}
