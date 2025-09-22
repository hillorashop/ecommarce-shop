"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Step1PersonalInfo } from "./step1-personal-info";
import { Step2BusinessDetails } from "./step2-business-details";
import { Step3ReviewSubmit } from "./step3-review-submit";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessFormSchema } from "@/lib/zod-schema";
import { Form } from "./ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Label } from "./ui/label";

export type BusinessFormValues = z.infer<typeof businessFormSchema>

export const SellerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
    const [formStep, setFormStep] = useState<"createSeller" | "verifyOtp">("createSeller");
    const [otp, setOtp] = useState("");

    const bussnessForm = useForm<BusinessFormValues>({
  resolver: zodResolver(businessFormSchema),
  defaultValues: {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  businessName: "",
  businessType: "",
  description: "",
  division: "",
  district: "",
  subDistrict: "",
  zipCode: "",
  address: "",
  agreeToTerms: false,
      },
    });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;


  const nextStep = () => setCurrentStep((s) => Math.min(totalSteps, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleSellerSubmit = (data:BusinessFormValues) => {
    console.log(data);
    bussnessForm.reset()
    setFormStep("verifyOtp")
    // send to API
  };
const handleOtpSubmit = () => {
  console.log("Hello world")
}

  return (
    <div className="mx-auto max-w-6xl">

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

  <Card>

<CardHeader className="text-center pb-8">
  {formStep === "createSeller" && (
    <>
      {currentStep === 1 && (
        <>
          <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
          <CardDescription>
            নিজে এবং আপনার Business সম্পর্কে তথ্য দিন
          </CardDescription>
        </>
      )}
      {currentStep === 2 && (
        <>
          <CardTitle>ব্যবসার বিবরণ</CardTitle>
          <CardDescription>
            আমাদের আপনার Business আরও ভালোভাবে বুঝতে সাহায্য করুন
          </CardDescription>
        </>
      )}
      {currentStep === 3 && (
        <>
          <CardTitle>পর্যালোচনা এবং Submit</CardTitle>
          <CardDescription>
            আপনার তথ্য Review করুন এবং Registration সম্পন্ন করুন
          </CardDescription>
        </>
      )}
    </>
  )}

  {formStep === "verifyOtp" && (
    <>
      <CardTitle>Email Verification</CardTitle>
      <CardDescription>
        আপনার ইমেলে পাঠানো ৬-সংখ্যার কোডটি লিখুন এবং রেজিস্ট্রেশন সম্পন্ন করুন।
      </CardDescription>
    </>
  )}
</CardHeader>

<CardContent className="p-2 px-4 md:p-6">
  {
    formStep === "createSeller" ? (
        <Form {...bussnessForm}>
    {currentStep < totalSteps && (
      <div>
        {currentStep === 1 && <Step1PersonalInfo control={bussnessForm.control} />}
        {currentStep === 2 && <Step2BusinessDetails control={bussnessForm.control} />}
      </div>
    )}

    {currentStep === totalSteps && (
      <form onSubmit={bussnessForm.handleSubmit(handleSellerSubmit)}>
        <Step3ReviewSubmit data={bussnessForm.getValues()} />

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={prevStep}
            className="min-w-24 bg-transparent"
          >
            Back
          </Button>

          <Button type="submit" className="min-w-32">
            Submit Application <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    )}

    {currentStep < totalSteps && (
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="min-w-24 bg-transparent"
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={nextStep}
          className="min-w-24"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )}
  </Form>
    ) : (
<form onSubmit={handleOtpSubmit} className="space-y-4 lg:space-y-6">
  <div className="space-y-2">
    <Label className="block text-sm font-medium text-gray-700">
      Enter OTP
    </Label>

    <InputOTP
      maxLength={6}
      value={otp}
      onChange={setOtp}
      autoFocus
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>

      <InputOTPSeparator />

      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>

    {/* Bengali instruction message */}
    <p className="text-sm text-gray-600 pt-1">
      অনুগ্রহ করে আপনার ইমেইলে পাঠানো ওটিপি কোডটি চেক করুন।
    </p>
  </div>

  <Button type="submit" className="w-full" disabled={ otp.length < 6}>
    {/* {isLoading ? (
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 animate-spin" />
        Verifying...
      </div>
    ) : (
      "Verify Email"
    )} */}

    Verify Email
  </Button>
</form>
    )
  }

</CardContent>

</Card>

    </div>
  );
};
