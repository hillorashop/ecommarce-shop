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

  const getShortDescription = (content: string, maxLength = 150) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length <= maxLength
      ? plainText
      : plainText.substring(0, maxLength) + "...";
  };

  const date = formatDate(blog.createdAt);
  const shortDescription = getShortDescription(blog.content);

  return (
    <div
      className={cn(
        "group overflow-hidden shadow-xl rounded-xl space-y-4",
        className
      )}
    >
      {/* Image + Blob Date Badge */}
      <Link
        href={`/blogs/${blog.url}`}
        className="block relative overflow-hidden"
      >
        <div className="relative w-full aspect-[16/9] md:aspect-[9/3]">
          <Image
            src={blog.desktopCoverImage}
            alt={blog.title}
            fill
            className="object-contain hidden md:block"
            priority={false}
          />
          <Image
            src={blog.mobileCoverImage}
            alt={blog.title}
            fill
            className="object-contain block md:hidden"
            priority={false}
          />

          {/* Blob date badge — top left */}
          <div className="absolute top-2 left-2 flex flex-col items-center">
            {/* Pulse rings */}
            <div className="relative flex items-center justify-center w-14 h-14">
              <span className="absolute inset-0 rounded-[30%_80%_55%_45%/50%_45%_75%_50%] bg-primary/25 animate-ping" />
              <span
                className="absolute inset-0 rounded-[30%_80%_55%_45%/50%_45%_75%_50%] bg-primary/15 animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              {/* Blob */}
              <div className="relative z-10 w-14 h-14 rounded-[30%_80%_55%_45%/50%_45%_75%_50%] bg-primary flex flex-col items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-lg font-bold text-white leading-none">
                  {date.day}
                </span>
                <span className="text-[9px] font-semibold text-white tracking-wide leading-tight">
                  {date.month}
                </span>
              </div>
            </div>

            {/* Outgoing beam lines */}
            <div className="mt-1 flex flex-col gap-[3px] pl-1">
              <BeamLine delay="0s" width="w-7" opacity="bg-primary/70" />
              <BeamLine delay="0.25s" width="w-5" opacity="bg-primary/50" />
              <BeamLine delay="0.5s" width="w-3" opacity="bg-primary/30" />
            </div>
          </div>
        </div>
      </Link>

      {/* Title */}
      <div className="px-4">
        <Link href={`/blogs/${blog.url}`}>
          <h3 className="text-lg md:text-xl font-semibold line-clamp-2 text-primary transition-colors">
            {truncateTitle(blog.title)}
          </h3>
        </Link>
      </div>

      <div className="px-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3 font-semibold">
          {shortDescription}
        </p>
      </div>

<div className="px-4">
  <Separator/>
</div>
    

      {/* CTA */}
      <div className="p-4 pt-0">
<Link
  href={`/blogs/${blog.url}`}
  className="inline-flex items-center gap-x-1 text-primary font-bold text-sm leading-none"
>
  <span className="leading-none">Continue Reading</span>
  <ChevronRight className="size-4 stroke-2 translate-y-px" />
</Link>
      </div>
    </div>
  );
};


const BeamLine = ({
  delay,
  width,
  opacity,
}: {
  delay: string;
  width: string;
  opacity: string;
}) => (
  <div
    className={`h-0.5 rounded-full ${width} ${opacity} origin-left animate-[beam-out_1.8s_ease-out_infinite]`}
    style={{ animationDelay: delay }}
  />
);