// components/OurMission.tsx

import Image from "next/image"; // Use Next.js Image component for optimized images
import { Button } from "../ui/button";
import mission from "@/assets/mission.png";
import guest from "@/assets/for-guest.png";
import hotels from "@/assets/for-hotels.png";
import { BlueUnderline } from "../shared/blue-underline";

const items = [
  {
    id: "mission",
    title: "Our Mission",
    description:
      "Ensuring lost items are returned securely, efficiently, and with complete peace of mind for both guests and businesses. Ensuring lost items are returned securely, efficiently, and with complete peace of.",
    image: mission,
    reverse: false,
    btn: "View More",
  },
  {
    id: "guest",
    title: "For Guest",
    description:
      "Helping guests recover their lost items quickly, safely, and hassle-free.Helping guests recover their lost items quickly, safely, and hassle-free.Helping guests recover their lost items quickly, safely, and",
    image: guest,
    reverse: true,
    btn: "View More",
  },
  {
    id: "business",
    title: "For Hotels & Business",
    description:
      "Streamlining lost-and-found management, reducing liability, and saving staff time.Streamlining lost-and-found management, reducing liability, and saving staff time.",
    image: hotels,
    reverse: false,
    btn: "View More",
  },
];

export default function OurMission() {
  return (
    <div className="bg-secondary">
      <div className="max-w-7xl mx-auto px-4 py-20 pb-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simplifying Lost & Found Recovery <br className="hidden md:block" />
            for Hotels and Guests.
          </h2>
          <BlueUnderline />
        </div>

        <div className="">
          {items?.map((data) => (
            <div
              key={data?.id}
              className={`flex flex-col md:flex-row ${
                data?.reverse ? "md:flex-row-reverse" : "flex"
              } gap-10 justify-center items-center py-10 last:pb-0`}
            >
              <div
                className={`flex-1 flex flex-col ${
                  data?.reverse ? "items-end" : "items-start"
                }`}
              >
                <h2 className="text-black text-3xl md:text-4xl font-semibold mb-4">
                  {data?.title}
                </h2>
                <p
                  className={`text-zinc-500 text-lg md:text-xl font-normal mb-6 ${
                    data?.reverse ? "text-end" : "text-start"
                  }`}
                >
                  {data?.description}
                </p>
                <Button className="flex items-center gap-5 text-white px-9 py-6 rounded-2xl bg-gradient-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in">
                  {data?.btn}
                </Button>
              </div>
              <div
                className={`flex-1 flex flex-col ${
                  data?.reverse ? "items-start" : "items-end"
                }`}
              >
                <Image
                  src={data?.image}
                  alt={data?.title}
                  className="w-[500px] h-auto pointer-events-none select-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
