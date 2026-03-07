// "use client";
// import { selectCurrentUser } from "@/redux/features/auth/authSlice";
// import { useAppSelector } from "@/redux/hook";
// import React from "react";

// export default function layout({ children }: { children: React.ReactNode }) {
//     const user = useAppSelector(selectCurrentUser);
//     console.log(user);

//     return <>{children}</>;
// }

"use client";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
