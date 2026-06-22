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
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const getShortDescription = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const shortDescription = getShortDescription(blog.content);

  return (
    <Card className={cn(
      "group overflow-hidden",
      className
    )}>
      <Link href={`/blogs/${blog.url}`} className="block relative overflow-hidden">
        <div className="relative w-full">
          <div className="aspect-[16/9] md:aspect-[9/3]">
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
          </div>
        </div>
      </Link>

      <CardHeader className="px-4">
        <Link href={`/blogs/${blog.url}`}>
          <h3 className="text-lg md:text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
            {truncateTitle(blog.title)}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="px-4  space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/blogs/${blog.url}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full"
          >
            Read More
            <span className="ml-2">→</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};