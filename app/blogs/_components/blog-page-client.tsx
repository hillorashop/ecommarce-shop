import { dbBlog } from "@/types/type";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Calendar, Menu, User } from "lucide-react";
import { siteMeta } from "@/data";
import { ShareButtons } from "./share-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  blog: dbBlog;
}

export const BlogPageClient = ({ blog }: Props) => {
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return {
      day: d.toLocaleDateString("en-US", { day: "numeric" }),
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      full: d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  const date = formatDate(blog.createdAt);
  const desktopCover = blog.desktopCoverImage?.trim() || blog.mobileCoverImage?.trim() || "/banners/hillora-meta.jpg";
  const mobileCover = blog.mobileCoverImage?.trim() || blog.desktopCoverImage?.trim() || "/banners/hillora-meta.jpg";

  return (
    <article className="mx-auto max-w-5xl w-full px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 font-medium mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-primary" />
            <span>{date.full}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="size-4 text-primary" />
            <span>Posted by <span className="text-gray-900 font-semibold">{siteMeta.siteName}</span></span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl shadow-lg border border-gray-100 mb-8 bg-gray-50">
        {desktopCover === mobileCover ? (
          <Image
            src={desktopCover}
            alt={blog.title || "Blog cover"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <>
            <Image
              src={desktopCover}
              alt={blog.title || "Blog cover"}
              fill
              className="object-cover hidden md:block"
              priority
            />
            <Image
              src={mobileCover}
              alt={blog.title || "Blog cover"}
              fill
              className="object-cover block md:hidden"
              priority
            />
          </>
        )}

        {/* Clean Date Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-md text-gray-900 shadow-md rounded-lg px-3 py-1.5 text-center border border-gray-100 flex flex-col items-center">
            <span className="text-base sm:text-lg font-extrabold text-gray-900 leading-none">
              {date.day}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-primary tracking-wider uppercase leading-tight mt-0.5">
              {date.month}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 lg:p-10 mb-8">
        <div className="prose prose-base sm:prose-lg max-w-none text-gray-800 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>

      <Separator className="my-8" />
      <div className="flex items-center justify-center w-full">
        <ShareButtons
          title={blog.title}
          url={`${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_WWW_URL}/blogs/${blog.url}`}
        />
      </div>
      <Separator className="my-8" />
      <div className="flex items-center justify-center w-full">
        <Link href={`/blogs`}>
          <Button variant={"outline"} className="cursor-pointer">
            <Menu className="mr-2 h-4 w-4" />
            <span>Back to list</span>
          </Button>
        </Link>
      </div>
    </article>
  );
};
