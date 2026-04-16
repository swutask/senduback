import OtpVerify from "@/components/auth/otp-verify-form";
import Image from "next/image";

const page = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 md:p-4"
      style={{ background: "linear-gradient(0deg, #092F60 0%, #092F60 100%)" }}
    >
      <div className="flex flex-col justify-center ">
        <div className="mb-6">
          <Image
            src={require("@/assets/otp-verify.png")}
            alt="send u back logo"
            width={500}
            height={500}
            className="w-20 h-20 mx-auto mb-4"
          />
          <div className="mb-2 text-center text-white">
            <h2 className="text-2xl font-bold mb-1">SendUBack</h2>
            <p className="text-sm">Verify your email</p>
          </div>
        </div>
        <OtpVerify />
        <p className="text-white text-center mt-3">
          © 2026 SendUBack. All rights reserved.{" "}
        </p>
      </div>
    </div>
  );
};

export default page;
