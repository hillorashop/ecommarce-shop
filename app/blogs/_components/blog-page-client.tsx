import { dbBlog } from "@/types/type";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  blog: dbBlog;
}

export const BlogPageClient = ({ blog }: Props) => {
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const readingTime = (content: string) => {
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  return (
    <article className="w-full px-4 py-8">

      <header className="mb-2">

        <h1 className="text-xl  lg:text-2xl xl:text-3xl font-bold mb-4 leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>

    
      </header>

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
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      <Separator className="my-8" />
      
    </article>
  );
};