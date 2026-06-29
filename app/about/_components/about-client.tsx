"use client";

import { Loader } from "lucide-react";
import { HeadingTitle } from "@/components/heading-title";
import { getAboutInfo } from "@/actions/business-info"; 
import { useCustomQuery } from "@/hooks/use-custom-query";

export const AboutClient = () => {
  const { data, isLoading, error } = useCustomQuery<{ data: any }>(
    ["get-about"],
    () => getAboutInfo()
  );

  const aboutData = data?.data;
  const aboutContent = aboutData?.aboutContent || "";


  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl w-full px-6 py-8 space-y-4 min-h-[60vh] flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl w-full px-6 py-8 space-y-4 min-h-[60vh]">
        <HeadingTitle title="About Hillora" />
        <p className="text-red-500">Failed to load about content. Please try again later.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl w-full px-6 py-8 space-y-4 min-h-[60vh]">
      <HeadingTitle title="About Hillora" />
      {aboutContent ? (
        <>
          <div
            className="tiptap"
            dangerouslySetInnerHTML={{ __html: aboutContent }}
          />
        </>
      ) : (
        <p className="text-muted-foreground">
          No about content available at the moment. Please check back later.
        </p>
      )}
    </main>
  );
};


