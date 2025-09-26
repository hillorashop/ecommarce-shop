"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";
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
import axios from "axios";


export type BusinessFormValues = z.infer<typeof businessFormSchema>

export const SellerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
    const [formStep, setFormStep] = useState<"createSeller" | "verifyOtp" | "successMessage">("createSeller");
    const [otp, setOtp] = useState("");
    const [pending , setPending] = useState(false)
    const [userEmail, setUserEmail] = useState("");
    const [registerError, setRegisterError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

  const bussnessForm = useForm<BusinessFormValues>({
  resolver: zodResolver(businessFormSchema),
  mode: "onChange",       
  reValidateMode: "onChange", 
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


  // validate current step before going forward

const nextStep = async () => {
  let fieldsToValidate: (keyof BusinessFormValues)[] = [];

  if (currentStep === 1) {
    fieldsToValidate = ["firstName", "lastName", "email", "mobileNumber"];
  } else if (currentStep === 2) {
    fieldsToValidate = [
      "businessName",
      "businessType",
      "description",
      "division",
      "district",
      "subDistrict",
      "zipCode",
      "address",
      "agreeToTerms",
    ];
  }

  const isValid = await bussnessForm.trigger(fieldsToValidate);

  if (isValid) {
    setCurrentStep((s) => Math.min(totalSteps, s + 1));
  }
};

  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

const handleSellerSubmit = async (data: BusinessFormValues) => {
  try {
    setPending(true);
    setSuccessMessage(""); // clear before new request
    setRegisterError("");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/admin/seller/create-seller`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 200) {
      setUserEmail(data.email);
      setSuccessMessage(response.data.message);
      setFormStep("verifyOtp");
    }
  } catch (error: any) {
    setSuccessMessage("");
    const message = axios.isAxiosError(error)
      ? error.response?.data?.error || "Seller Registration failed"
      : "Unexpected error occurred.";
    setRegisterError(message);
  } finally {
    setPending(false);
    bussnessForm.reset();
  }
};


const handleOtpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (otp.length < 6) return;

  try {
    setPending(true);
    setSuccessMessage(""); // clear before verify
    setRegisterError("");

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_ADMIN_URL}/api/admin/seller/seller-otp-verify`,
      { email: userEmail, otp }
    );

    if (res.status === 200) {
      setSuccessMessage(res.data.message);
      setFormStep("successMessage");
    }
  } catch (error: any) {
    setSuccessMessage("");
    const message = axios.isAxiosError(error)
      ? error.response?.data?.error || "OTP verification failed"
      : "Unexpected error occurred.";
    setRegisterError(message);
  } finally {
    setPending(false);
  }
};



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

  {formStep !== "successMessage" && (
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
            আপনার Email ঠিকানা যাচাই করার জন্য আমরা একটি OTP পাঠাবো। অনুগ্রহ করে ইনবক্স চেক করবেন এবং নিচে কোডটি লিখে ভেরিফিকেশন সম্পন্ন করবেন।
          </CardDescription>
        </>
      )}
    </CardHeader>
  )}


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
      <form onSubmit={bussnessForm.handleSubmit(handleSellerSubmit)} className="space-y-4">
        <Step3ReviewSubmit data={bussnessForm.getValues()} />
      {successMessage && <p className="text-sm lg:text-base font-medium text-green-600 pt-1">{successMessage}</p>}
     {registerError && <p className="text-sm lg:text-base font-medium text-red-600 pt-1">{registerError}</p>}

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            type="button"
            onClick={prevStep}
            className="min-w-24 bg-transparent"
          >
            Back
          </Button>
          <Button type="submit" className="min-w-32" disabled={pending}>
                {pending ? (
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 animate-spin" />
       Submiting Application...
      </div>
    ) : (
           <p className="flex items-center gap-x-4">Submit Application <CheckCircle className="ml-2 h-4 w-4" /></p> 
    )}
         
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
    ) : formStep === "successMessage" ? (
       <div className="flex flex-col items-center justify-center p-4 space-y-6 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-green-700">
          Verification Successful!
        </h2>

        <p className="text-base text-gray-600 max-w-xl">
          {successMessage || "Your email has been verified successfully. Welcome to Hillora! 🎉"}
        </p>

      </div>
    ) :  (
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

     {successMessage && <p className="text-sm  text-green-600 pt-1">{successMessage}</p>}
     {registerError && <p className="text-sm   text-red-600 pt-1">{registerError}</p>}

  </div>

  <Button type="submit" disabled={ pending || otp.length < 6}>
    {pending ? (
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 animate-spin" />
        Verifying...
      </div>
    ) : (
      "Verify Email"
    )}


  </Button>
</form>

    )
  }

</CardContent>

</Card>

    </div>
  );
};
