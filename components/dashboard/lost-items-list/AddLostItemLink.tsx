"use client";

import { useGetCurrentUserQuery } from "@/redux/features/user/userApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";

interface AddLostItemLinkProps {
  children: ReactNode;
}

const AddLostItemLink = ({ children }: AddLostItemLinkProps) => {
  const router = useRouter();
  const { data: user, isLoading } = useGetCurrentUserQuery(undefined);

  if (isLoading) {
    return <div className="pointer-events-none opacity-50">{children}</div>;
  }

  const businessDetails = user?.data?.businessDetails;

  const hasRequiredFields =
    businessDetails?.address?.state &&
    businessDetails?.address?.country &&
    businessDetails?.businessEmail;

  const handleClick = (e: React.MouseEvent) => {
    if (!hasRequiredFields) {
      e.preventDefault();
      toast.error("Fill up business details first");
      router.push("/dashboard/settings");
    }
  };

  const href = hasRequiredFields
    ? "/dashboard/add-lost-item"
    : "/dashboard/settings";

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default AddLostItemLink;
