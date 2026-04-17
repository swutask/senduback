import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/static/",
          "/dashboard/",
          "/payments/",
          "/upload/",
          "/auth/",
          "/signin/",
          "/signup/",
          "/login/",
          "/register/",
          "/verify-otp/",
          "/reset-password/",
          "/forgot-password/",
          "/business-details/",
        ],
      },
    ],
    sitemap: "https://senduback.com/sitemap.xml",
  };
}
