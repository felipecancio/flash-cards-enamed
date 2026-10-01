import { getCheckoutUrl } from "@/lib/publication";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  if (!getCheckoutUrl()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
