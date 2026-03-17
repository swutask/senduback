import Summerycard from "@/components/dashboard/adminDashboard/summerycard";
import RecentLostItem from "@/components/dashboard/lost-items/RecentLostItem";
import RecentShippings from "@/components/dashboard/shipping/RecentShippings";
import Image from "next/image";

export default function page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Image
          src={require("@/assets/amdin-user.png")}
          alt="Admin Icons"
          width={200}
          height={200}
          className="w-10 h-10"
        />
        <h2 className="text-2xl font-bold">Super Admin</h2>
      </div>

      <Summerycard />
      <RecentShippings />
      <RecentLostItem />
    </div>
  );
}
