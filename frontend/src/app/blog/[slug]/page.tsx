import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-data";
import { BlogArticle } from "@/components/blog/blog-article";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return { title: "Не найдено" };
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | Блог ${SITE_NAME}`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
