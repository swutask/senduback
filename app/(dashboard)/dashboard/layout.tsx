import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DynamicHeader } from "@/utils/dynamic-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-0">
          <DynamicHeader />
          <div className="flex-1 bg-[#F9FAFB] p-2 py-4 md:p-4 lg:p-8 overflow-auto relative">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
