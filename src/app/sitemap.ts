import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/studio`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
