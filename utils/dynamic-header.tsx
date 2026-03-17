"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { menuItems, UserRole, useUserRole } from "@/config/menuConfig";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hook";
import { Building2, CircleUser, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

/* ----------------------------------------
   PURE FUNCTION (NO HOOKS HERE)
----------------------------------------- */
function getPageTitle(pathname: string, role: keyof typeof menuItems): string {
  const items = menuItems[role] ?? [];

  const exactMatch = items.find((item) => item.url === pathname);
  if (exactMatch) return exactMatch.title;

  const nestedMatch = items.find(
    (item) => item.url !== "/dashboard" && pathname.startsWith(item.url),
  );
  if (nestedMatch) return nestedMatch.title;

  if (pathname.startsWith("/dashboard")) {
    const dashboardItem = items.find((item) => item.url === "/dashboard");
    return dashboardItem?.title || "Dashboard";
  }

  return "Overview";
}

/* ----------------------------------------
   COMPONENT
----------------------------------------- */
export function DynamicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const pathname = usePathname();

  const role: UserRole = user?.role ?? "user";
  // const pageTitle = getPageTitle(pathname, role);
  const items = menuItems[role];

  const { data: profileResponse } = useGetCurrentUserQuery(undefined);

  const myProfile = profileResponse?.data;

  const getUserFullName = () =>
    `${myProfile?.firstName ?? ""} ${myProfile?.lastName ?? ""}`.trim() ||
    "User";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
  };

  return (
    <div className="relative">
      <div className="absolute top-1/2 -translate-y-1/2 hidden md:block h-12 w-0.5 bg-white/25"></div>
      <div
        className="flex items-center justify-between md:p-4 h-16"
        style={{
          background:
            "linear-gradient(180deg, #0F172A 0%, #1E3A8A 60%, #1E40AF 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="">
            <SidebarTrigger className="text-white" />
          </div>
          {/* <h1 className="text-xl text-white">{pageTitle}</h1> */}
          <h1 className="text-base text-white flex items-center gap-2 ">
            <Building2 />{" "}
            <span>
              {myProfile?.businessDetails?.businessName || "Dashboard"}
            </span>
          </h1>
        </div>

        <div className="flex items-center justify-between pr-6">
          <p className="text-white text-base capitalize px-4 py-3 pr-6 mr-6 border-r-2 border-r-white/25">
            {myProfile?.role}
          </p>
          <Menu
            className="text-white size-8 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out
  ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          boxShadow: "0px 30px 70px rgba(0, 150, 255, 0.25)",
        }}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* USER INFO */}
          <div className="flex items-center gap-3">
            {myProfile?.image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BASEURL}${myProfile.image}`}
                className="h-12 w-12 rounded-full object-cover border"
                alt="User"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <CircleUser className="size-11 text-white" />
              </div>
            )}

            <div>
              <p className="font-semibold">{getUserFullName()}</p>
              <p className="text-sm capitalize text-gray-600">
                {myProfile?.role}
              </p>
            </div>
          </div>

          {/* LINKS */}
          <div className="flex flex-col items-start gap-4">
            {/* <button className="text-left text-lg font-semibold hover:text-primary">
              Account Settings
            </button> */}

            <SidebarContent
              className="mt-8 overflow-y-auto p-0 !scrollbar-thin !scrollbar-thumb-[#0096FF] !scrollbar-track-transparent"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#0096FF transparent",
              }}
            >
              <SidebarGroup className="p-0 pb-6 border-b border-white/20">
                <SidebarGroupContent>
                  <SidebarMenu className="gap-2">
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
                            ? "bg-[linear-gradient(180deg,rgba(0,148,252,0.80)_19.32%,rgba(1,106,207,0.80)_100%)] text-white!"
                            : "hover:bg-[linear-gradient(180deg,rgba(0,148,252,0.80)_19.32%,rgba(1,106,207,0.80)_100%)] "
                        }`}
                      >
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className="text-lg! flex items-center gap-2.5 hover:text-white p-0! bg-transparent! !hover:bg-transparent focus-visible:shadow-none active:text-white!"
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
          </div>

          {/* LOGOUT */}
          <div className="border-t pt-6">
            <Button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              variant="outline"
              className="w-full bg-red-600 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
