"use client";

// import React from "react";
// import { CheckCircle2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import { BookingConfirmed } from "@/components/lost-item/screens";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    // <div className="min-h-screen flex items-center justify-center px-4 bg-secondary">
    //   <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-primary text-center p-8 space-y-6">
    //     {/* Success Icon */}
    //     <div className="flex justify-center">
    //       <CheckCircle2 className="w-16 h-16 text-primary" />
    //     </div>

    //     {/* Title */}
    //     <h1 className="text-2xl font-bold text-gray-900">
    //       Payment Successful 🎉
    //     </h1>

    //     {/* Description */}
    //     <p className="text-gray-600">
    //       Thank you for your purchase. Your plan has been activated and you’re
    //       all set to continue!
    //     </p>

    //     {/* Actions */}
    //     <div className="flex flex-col sm:flex-row gap-4 justify-center">
    //       {/* <Link href="/dashboard">
    //                     <Button className="bg-green-900 hover:bg-green-800 text-white w-full sm:w-auto">Go to Dashboard</Button>
    //                 </Link> */}
    //       <Link href="/">
    //         <Button
    //           variant="secondary"
    //           className="bg-transparent hover:bg-primary text-primary hover:text-white border-2 border-primary hover:border-primary w-full sm:w-auto"
    //         >
    //           Back to Home
    //         </Button>
    //       </Link>
    //     </div>
    //   </div>
    // </div>
    <BookingConfirmed onNewBooking={() => router.replace("/")} />
  );
};

export default page;
