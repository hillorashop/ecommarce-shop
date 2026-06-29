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

  return (
    <article className="mx-auto max-w-7xl w-full px-4 py-8">

      <header className="mb-2">
        <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-4 leading-tight">
          {blog.title}
        </h1>

<div className="flex flex-wrap items-center gap-4 text-sm font-semibold mb-6">
  <div className="flex items-center gap-1.5">
    <Calendar className="size-4" />
    <span>{date.full}</span>
  </div>
  <div className="flex items-center gap-1.5">
    <User className="size-4" />
    <span>Posted by <span className="text-primary">{siteMeta.siteName}</span></span>
  </div>
</div>
      </header>

      {/* Image + Blob Date Badge */}
      <div className="relative w-full aspect-[16/9] md:aspect-[9/3] overflow-hidden mb-8">
        <Image
          src={blog.desktopCoverImage}
          alt={blog.title}
          fill
          className="object-contain hidden md:block"
          priority
        />
        <Image
          src={blog.mobileCoverImage}
          alt={blog.title}
          fill
          className="object-contain block md:hidden"
          priority
        />

        {/* Blob date badge — top left */}
        <div className="absolute top-2 md:top-4 lg:top-6 left-1 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-14 h-14">
            <span className="absolute inset-0 rounded-[30%_80%_55%_45%/50%_45%_75%_50%] bg-primary/25 animate-ping" />
            <span
              className="absolute inset-0 rounded-[30%_80%_55%_45%/50%_45%_75%_50%] bg-primary/15 animate-ping"
              style={{ animationDelay: "0.5s" }}
            />
            <div className="relative z-10 w-14 h-14 rounded-[30%_80%_55%_45%/50%_45%_75%_50%] bg-primary flex flex-col items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-lg font-bold text-white leading-none">
                {date.day}
              </span>
              <span className="text-[9px] font-semibold text-white tracking-wide leading-tight">
                {date.month}
              </span>
            </div>
          </div>

          <div className="mt-1 flex flex-col gap-[3px] pl-1">
            <BeamLine delay="0s" width="w-7" opacity="bg-primary/70" />
            <BeamLine delay="0.25s" width="w-5" opacity="bg-primary/50" />
            <BeamLine delay="0.5s" width="w-3" opacity="bg-primary/30" />
          </div>
        </div>
      </div>

<div className="shadow-xl rounded-md p-4">
   <div className="prose prose-lg dark:prose-invert max-w-none">
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
<Separator className="my-8"/>
<div className="flex items-center justify-center w-full">
  <Link href={`/blogs`}>
  <Button variant={"outline"} >
    <Menu className="mr-2"/>
    <span>Back to list </span>
</Button>
  </Link>

</div>

    </article>
  );
};