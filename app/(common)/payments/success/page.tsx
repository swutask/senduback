"use client";


import { BookingConfirmed } from "@/components/lost-item/screens";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    
    <BookingConfirmed onNewBooking={() => router.replace("/")} />
  );
};

export default page;
