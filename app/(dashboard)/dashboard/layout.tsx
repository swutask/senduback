import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DynamicHeader } from "@/utils/dynamic-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-[#F5F6FA]">
      <div className="flex w-full h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <DynamicHeader />
          <div className="flex-1 bg-[#F9FAFB] p-4 overflow-auto relative">
            {children}
            {/* <RoleSwitcher /> */}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
