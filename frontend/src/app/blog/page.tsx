import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BlogPageContent } from "./content";

export const metadata: Metadata = {
  title: `Блог — статьи и новости | ${SITE_NAME}`,
  description: `Новости студии, разработка сайтов и продуктов, UX/UI, AI и автоматизация. Материалы и заметки команды ${SITE_NAME}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogPageContent posts={BLOG_POSTS} />;
}
