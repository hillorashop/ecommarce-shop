"use client";

import { Control } from "react-hook-form";
import { BusinessFormValues } from "./seller-onboarding";
import { FormField } from "./ui/form";
import { CustomForm } from "./ui/custom-form";
import { useEffect, useState } from "react";
import { bangladeshPlaces } from "@/data/divison";
import Link from "next/link";

interface StepProps {
  control: Control<BusinessFormValues>;
}

export const Step2BusinessDetails = ({ control }: StepProps) => {
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [districts, setDistricts] = useState<{ name: string; subDistricts: string[] }[]>([]);
  const [subDistricts, setSubDistricts] = useState<string[]>([]);

  useEffect(() => {
    const division = bangladeshPlaces.find((d) => d.division === selectedDivision);
    setDistricts(division ? division.districts : []);
    setSubDistricts([]); // reset subdistricts when division changes
  }, [selectedDivision]);

  const handleDistrictChange = (districtName: string) => {
    const district = districts.find((d) => d.name === districtName);
    setSubDistricts(district ? district.subDistricts : []);
  };

return (
  <div className="space-y-8 mb-4">
    {/* Business Description */}
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
    
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <CustomForm
          field={field}
          fieldType="textarea"
          label="ব্যবসার বিবরণ"
          placeHolder="আপনার ব্যবসা সম্পর্কে লিখুন..."
          important
        />
      )}
    />

    {/* Division & District */}
    <div className="grid md:grid-cols-2 gap-8">
      <FormField
        control={control}
        name="businessType"
        render={({ field }) => (
          <CustomForm
            field={field}
            label="ব্যবসার ধরন"
            fieldType="select"
            placeHolder="ব্যবসার ধরন নির্বাচন করুন"
            important
            options={[
              { label: "ব্যক্তিগত", value: "ব্যক্তিগত" },
              { label: "কর্পোরেশন", value: "কর্পোরেশন" },
              { label: "অংশীদারিত্ব", value: "অংশীদারিত্ব" },
            ]}
          />
        )}
      />

      <FormField
        control={control}
        name="division"
        render={({ field }) => (
          <CustomForm
            field={{
              ...field,
              onChange: (value: string) => {
                field.onChange(value);
                setSelectedDivision(value);
              },
            }}
            label="বিভাগ"
            fieldType="select"
            placeHolder="বিভাগ নির্বাচন করুন"
            important
            options={bangladeshPlaces.map((d) => ({
              label: d.division,
              value: d.division,
            }))}
          />
        )}
      />
    </div>

    {/* District & Sub-district */}
    <div className="grid md:grid-cols-2 gap-8">
      <FormField
        control={control}
        name="district"
        render={({ field }) => (
          <CustomForm
            field={{
              ...field,
              onChange: (value: string) => {
                field.onChange(value);
                handleDistrictChange(value);
              },
            }}
            label="জেলা"
            fieldType="select"
            placeHolder="জেলা নির্বাচন করুন"
            important
            options={districts.map((d) => ({ label: d.name, value: d.name }))}
          />
        )}
      />

      <FormField
        control={control}
        name="subDistrict"
        render={({ field }) => (
          <CustomForm
            field={field}
            label="উপজেলা"
            fieldType="select"
            placeHolder="উপজেলা নির্বাচন করুন"
            important
            options={subDistricts.map((sd) => ({ label: sd, value: sd }))}
          />
        )}
      />
    </div>

    {/* Zip Code & Address */}
    <div className="grid md:grid-cols-2 gap-8">
      <FormField
        control={control}
        name="zipCode"
        render={({ field }) => (
          <CustomForm
            field={field}
            fieldType="input"
            label="পোস্টকোড"
            placeHolder="4404"
            important
          />
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <CustomForm
            field={field}
            fieldType="input"
            label="ব্যবসার ঠিকানা"
            placeHolder="অ্যাপল টাওয়ার, কলেজ গেইট, খাগড়াছড়ি কলেজ রোড, খাগড়াছড়ি পৌরসভা"
            important
          />
        )}
      />
    </div>

    {/* Terms & Marketing Checkbox */}

      <FormField
        control={control}
        name="agreeToTerms"
        render={({ field }) => (
          <CustomForm
            field={field}
            fieldType="checkbox"
            label=""
            checkBoxLabel={
   <div className="text-sm leading-relaxed">
  আমি সম্মত{" "}
  <Link href="#" className="text-primary hover:underline">
    Business Policy
  </Link>{" "}
  এবং{" "}
  <Link href="/privacy-policy" className="text-primary hover:underline">
    Privacy Policy
  </Link>- এর সাথে
</div>
            }
          />
        )}
      />




  </div>
);

};