"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle} from "lucide-react";
import { BusinessFormValues } from "./seller-onboarding";

interface StepProps {
  data: BusinessFormValues;
}

export const Step3ReviewSubmit = ({ data }: StepProps) => {
  const {firstName, lastName, email, mobileNumber, businessName, businessType, description, division, district, subDistrict, zipCode, address} = data
return (
  <div className="space-y-6">

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">নাম:</span>
            <span>{firstName} {lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ইমেইল:</span>
            <span>{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">মোবাইল নাম্বার:</span>
            <span>{mobileNumber}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <CardTitle>ব্যবসার তথ্য</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ব্যবসার নাম:</span>
            <span>{businessName}</span>
          </div>
     <div className="flex justify-between">
  <span className="text-muted-foreground">ব্যবসার ধরন:</span>
  <span>{businessType}</span>
</div>
<div className="flex gap-x-2 flex-wrap">
  <span className="text-muted-foreground">ব্যবসার বর্ণনা:</span>
  <span>{description}</span>
</div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">বিভাগ:</span>
            <span>{division}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">জেলা:</span>
            <span>{district}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">উপজেলা:</span>
            <span>{subDistrict}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">পোস্টকোড:</span>
            <span>{zipCode}</span>
          </div>
      <div className="flex justify-between">
  <span className="text-muted-foreground">ব্যবসার ঠিকানা:</span>
  <span>{address}</span>
</div>
        </CardContent>
      </Card>
    </div>

<div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
  <h4 className="font-semibold mb-3">পরবর্তী ধাপ</h4>
  <div className="space-y-2 text-sm text-muted-foreground">
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-primary" />
      <span>আমরা আপনার আবেদন ২৪–৪৮ ঘণ্টার মধ্যে review করব</span>
    </div>
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-primary" />
      <span>
        অনুমোদনের পর আপনি email confirmation পাবেন, সাথে temporary password এবং admin access
      </span>
    </div>
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-primary" />
      <span>
        Admin access পাওয়ার পর আপনি সঙ্গে সঙ্গে আপনার products তালিকাভুক্ত করতে পারবেন
      </span>
    </div>
  </div>
</div>


  </div>
);

};
