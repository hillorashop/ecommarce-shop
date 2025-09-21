"use client";

import { Control } from "react-hook-form";
import { BusinessFormValues } from "./seller-onboarding";
import { FormField } from "./ui/form";
import { CustomForm } from "./ui/custom-form";

interface StepProps {
    control:Control<BusinessFormValues>
}

export const Step1PersonalInfo = ({control}: StepProps) => {

return (
  <div className="space-y-8">
    <div className="grid md:grid-cols-2 gap-8">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <CustomForm
            field={field}
            fieldType="input"
            label="প্রথম নাম"
            placeHolder="Arif"
            important
          />
        )}
      />

      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <CustomForm
            field={field}
            fieldType="input"
            label="শেষ নাম"
            placeHolder="Ahmad"
            important
          />
        )}
      />
    </div>

    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <CustomForm
          field={field}
          fieldType="input"
          inputType="email"
          label="ইমেইল ঠিকানা"
          placeHolder="example123@gmail.com"
          important
        />
      )}
    />

    <FormField
      control={control}
      name="mobileNumber"
      render={({ field }) => (
        <CustomForm
          field={field}
          fieldType="input"
          inputType="text"
          label="মোবাইল নাম্বার"
          placeHolder="+880"
          important
        />
      )}
    />

    <FormField
      control={control}
      name="businessName"
      render={({ field }) => (
        <CustomForm
          field={field}
          fieldType="input"
          label="ব্যবসার নাম"
          placeHolder="আপনার ব্যবসার নাম লিখুন"
          important
        />
      )}
    />
  </div>
);


};
