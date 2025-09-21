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

export type BusinessFormValues = z.infer<typeof businessFormSchema>

export const SellerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleSubmit = (data:BusinessFormValues) => {
    console.log(data);
    // send to API
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

  <CardHeader className="text-center pb-8">
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
  </CardHeader>
<CardContent className="p-2 md:p-6">
  <Form {...bussnessForm}>
    {currentStep < totalSteps && (
      <div>
        {currentStep === 1 && <Step1PersonalInfo control={bussnessForm.control} />}
        {currentStep === 2 && <Step2BusinessDetails control={bussnessForm.control} />}
      </div>
    )}

    {currentStep === totalSteps && (
      <form onSubmit={bussnessForm.handleSubmit(handleSubmit)}>
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
</CardContent>

</Card>

    </div>
  );
};
