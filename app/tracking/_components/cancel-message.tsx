"use client";

;

import { Button } from "@/components/ui/button";
import { useBusinessInfo } from "@/hooks/use-business-info";
import { XCircle } from "lucide-react"

export const CancelMessage = () => {

      const { data: businessInfo} = useBusinessInfo();
    return (
          <div className="mt-4 space-y-4 text-center">
            <XCircle className="mx-auto h-8 w-8 text-red-600 md:h-10 md:w-10" />
            <h3 className="text-lg font-bold tracking-tight text-foreground md:text-2xl">
              Order Cancelled
            </h3>
            <p className="mx-auto  max-w-md text-xs leading-relaxed  md:text-sm">
    
আপনার অর্ডার বাতিল করা হয়েছে।
            
            </p>
       
            <div className="space-y-4">
              <p className="text-xs font-medium md:text-sm">
           আমাদের সহায়তা দল আপনার ফেরত এবং ফেরতের বিষয়ে 24 ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করবে।
              </p>
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
            </div>
          </div>
    )
}