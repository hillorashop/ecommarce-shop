'use client';

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dbBlog } from "@/types/type";



interface BlogCardProps {
  blog: dbBlog;
  className?: string;
}

export const BlogCard = ({ blog, className }: BlogCardProps) => {
  // Format the date
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Truncate title if it's too long
  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  // Get a short description from content (first 150 characters)
  const getShortDescription = (content: string, maxLength: number = 150) => {
    // Remove HTML tags if any
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };



  const shortDescription = getShortDescription(blog.content);

  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      className
    )}>
      {/* Cover Image */}
      <Link href={`/blogs/${blog.url}`} className="block relative overflow-hidden">
        <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800">
          {/* Desktop Image */}
          <Image
            src={blog.desktopCoverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 hidden md:block"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Mobile Image */}
          <Image
            src={blog.mobileCoverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 block md:hidden"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <CardHeader className="p-4 pb-2">
        <Link href={`/blogs/${blog.url}`}>
          <h3 className="text-lg md:text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
            {truncateTitle(blog.title)}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* Short Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {shortDescription}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
    
 
        </div>

   
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/blogs/${blog.url}`} className="w-full">
          <Button 
            variant="ghost" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            Read More
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};