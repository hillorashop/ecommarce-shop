"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { dbBlog } from "@/types/type";
import { Separator } from "@/components/ui/separator";

interface BlogCardProps {
  blog: dbBlog;
  className?: string;
}

export const BlogCard = ({ blog, className }: BlogCardProps) => {
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

  const truncateTitle = (title: string, maxLength = 60) =>
    title.length <= maxLength ? title : title.substring(0, maxLength) + "...";

  const getShortDescription = (content: string, maxLength = 130) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length <= maxLength
      ? plainText
      : plainText.substring(0, maxLength) + "...";
  };

  const date = formatDate(blog.createdAt);
  const shortDescription = getShortDescription(blog.content);
  const desktopCover = blog.desktopCoverImage?.trim() || blog.mobileCoverImage?.trim() || "/banners/hillora-meta.jpg";
  const mobileCover = blog.mobileCoverImage?.trim() || blog.desktopCoverImage?.trim() || "/banners/hillora-meta.jpg";

  return (
    <div
      className={cn(
        "group overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl h-full flex flex-col justify-between",
        className
      )}
    >
      {/* Image + Date Badge */}
      <Link
        href={`/blogs/${blog.url}`}
        className="block relative overflow-hidden"
      >
        <div className="relative w-full aspect-[1600/895] md:aspect-[1600/500] overflow-hidden bg-gray-50">
          {desktopCover === mobileCover ? (
            <Image
              src={desktopCover}
              alt={blog.title || "Blog cover"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <>
              <Image
                src={desktopCover}
                alt={blog.title || "Blog cover"}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover hidden md:block transition-transform duration-500 group-hover:scale-105"
                priority={false}
              />
              <Image
                src={mobileCover}
                alt={blog.title || "Blog cover"}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover block md:hidden transition-transform duration-500 group-hover:scale-105"
                priority={false}
              />
            </>
          )}

          {/* Clean Modern Date Badge */}
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-white/95 backdrop-blur-md text-gray-900 shadow-md rounded-lg px-2.5 py-1 text-center border border-gray-100 flex flex-col items-center">
              <span className="text-sm sm:text-base font-extrabold text-gray-900 leading-none">
                {date.day}
              </span>
              <span className="text-[10px] font-bold text-primary tracking-wider uppercase leading-tight mt-0.5">
                {date.month}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Title & Description */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-2">
        <Link href={`/blogs/${blog.url}`} className="block">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
            {truncateTitle(blog.title)}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed font-normal">
          {shortDescription}
        </p>
      </div>

      <div className="px-4 sm:px-5">
        <Separator className="bg-gray-100" />
      </div>

      {/* CTA Footer */}
      <div className="p-4 sm:p-5 pt-3 mt-auto">
        <Link
          href={`/blogs/${blog.url}`}
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-semibold text-xs sm:text-sm group-hover:gap-2.5 transition-all"
        >
          <span>Continue Reading</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
