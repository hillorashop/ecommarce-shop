import { Metadata } from "next";
import Script from "next/script";
import { siteMeta } from "@/data";
import { getBlogByUrl } from "@/actions/blog";
import { notFound } from "next/navigation";
import { BlogPageClient } from "../_components/blog-page-client";


type Props = {
  params: Promise<{ blog_url: string }>;
};

const formatDateForSchema = (date: Date | string | null | undefined): string => {
  if (!date) return new Date().toISOString();
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      return dateObj.toISOString();
    }
    return new Date().toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blog_url } = await params;

  const res = await getBlogByUrl(blog_url);

  if (!res?.data) {
    return {
      title: `Blog not found | ${siteMeta.siteName}`,
      description: "The blog post you're looking for does not exist.",
    };
  }

  const blog = res.data;

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.content.substring(0, 160),
    keywords: blog.metaKeyWords || [],
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.content.substring(0, 160),
      url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/blogs/${blog.url}`,
      type: "article",
      siteName: siteMeta.siteName,
      images: [
        {
          url: blog.desktopCoverImage || `${siteMeta.siteName}.png`,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: "bn_BD",
      publishedTime: formatDateForSchema(blog.createdAt),
      modifiedTime: formatDateForSchema(blog.updatedAt),
      authors: [siteMeta.siteName],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.content.substring(0, 160),
      images: [blog.desktopCoverImage || `${siteMeta.siteName}.png`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/blogs/${blog.url}`,
    },
  };
}

const BlogPage = async ({ params }: Props) => {
  const { blog_url } = await params;

  const res = await getBlogByUrl(blog_url);


  if (!res?.data) {
    notFound();
  }

  const blog = res.data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.content.substring(0, 160),
    keywords: blog.metaKeyWords?.join(", ") || "",
    image: blog.desktopCoverImage,
    datePublished: formatDateForSchema(blog.createdAt),
    dateModified: formatDateForSchema(blog.updatedAt),
    author: {
      "@type": "Organization",
      name: siteMeta.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteMeta.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/${siteMeta.siteName}.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/blogs/${blog.url}`,
    },
  };

  return (
    <div>
      <Script
        type="application/ld+json"
        id="blog-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <BlogPageClient blog={blog} />
    </div>
  );
};

export default BlogPage;