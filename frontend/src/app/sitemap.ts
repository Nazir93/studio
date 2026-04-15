import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllBlogSlugs } from "@/lib/blog-data";
import { getAllExpertiseSlugs } from "@/lib/expertise-data";
import { getAllCaseSlugs } from "@/lib/portfolio-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/services/development`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/services/ai-automation`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/services/ux-ui-design`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/preproject-research`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/testing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/personal-cabinet`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/outstaff`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/price`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/brief`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const portfolioPages: MetadataRoute.Sitemap = getAllCaseSlugs().map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPosts: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const expertisePages: MetadataRoute.Sitemap = getAllExpertiseSlugs().map((slug) => ({
    url: `${baseUrl}/expertise/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...portfolioPages, ...blogPosts, ...expertisePages];
}
