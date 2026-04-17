import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg";

export default function PageFooter() {
  return (
    <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-400">
      <div className="mx-auto max-w-6xl px-6">
        <Link href="/" className="flex items-center justify-center mb-4">
          <Image
            src={logo}
            alt="SendUBack logo"
            width={110}
            height={36}
            className="object-contain"
          />
        </Link>

        <p>
          © {new Date().getFullYear()} SendUBack. All rights
          reserved.&nbsp;|&nbsp;
          <Link
            href="https://senduback.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-500 hover:underline"
          >
            senduback.com
          </Link>
          &nbsp;|&nbsp;
          <Link
            href="/privacy-policy"
            className="font-medium text-blue-500 hover:underline"
          >
            Privacy Policy
          </Link>
          &nbsp;|&nbsp;
          <Link
            href="/cookie-policy"
            className="font-medium text-blue-500 hover:underline"
          >
            Cookie Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}
