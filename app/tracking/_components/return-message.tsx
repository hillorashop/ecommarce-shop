"use client";

import { Button } from "@/components/ui/button";
import { useBusinessInfo } from "@/hooks/use-business-info";
import { XCircle } from "lucide-react";


export const ReturnMessage = () => {
  const { data: businessInfo } = useBusinessInfo();


  return (
    <div className="mt-8 flex flex-col items-center justify-center space-y-6 text-center">

      <XCircle className="h-12 w-12 text-red-600 md:h-14 md:w-14" />

   
      <h3 className="text-lg font-bold tracking-tight text-foreground md:text-2xl">
        Return Initiated
      </h3>


      <p className="max-w-md text-sm text-foreground/70 md:text-base">
        আপনার ফেরতের অনুরোধ গৃহীত হয়েছে।
      </p>


      <div className="space-y-3 max-w-md">
        <p className="text-sm text-foreground/60 md:text-base">
    
আমাদের সহায়তা দল আপনার ফেরত এবং ফেরতের বিষয়ে 24 ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করবে।
        </p>


        {businessInfo?.data?.customerCareNumber && (
          <Button
            onClick={() => {
         if (businessInfo?.data?.customerCareNumber) {
      window.location.href = `tel:${businessInfo.data.customerCareNumber}`;
    }
        }}
            className=""
          >
            Contact Support
          </Button>
        )}
      </div>
    </div>
  );
};