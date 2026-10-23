"use client";


import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { CustomForm } from "@/components/ui/custom-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap } from "lucide-react";
import { useAddressSuggestion } from "@/hooks/use-address-suggestion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaBagShopping } from "react-icons/fa6";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const shippingSchema = z.object({
  orderFor:z.string(),
  name: z.string().min(2, "নাম লিখুন").max(30, "সর্বোচ্চ ৩০ অক্ষর"),
  mobileNumber: z
    .string()
    .regex(/^(?:\+88)?01[3-9]\d{8}$/, "একটি সঠিক মোবাইল নাম্বার লিখুন"),
  address: z.string().min(5, "ঠিকানা লিখুন"),
  zilla: z.string().optional(),
  thana: z.string().optional(),
  specialNote: z.string().max(300, "সর্বোচ্চ ৩০০ অক্ষর").optional(),
  agreeToReturnPolicy: z.boolean().refine((val) => val === true, {
    message: "রিটার্ন পলিসি মেনে নিন",
  }),
});

export type ShippingForm = z.infer<typeof shippingSchema>;

const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when the product arrives at your door.",
    Icon: CiDeliveryTruck,
  },
];

interface ShippingPaymentFormProps {
  form: UseFormReturn<ShippingForm>;
  selectedPayment: string;
  setSelectedPayment: (id: string) => void;
  onSubmit: (data: ShippingForm) => void;
  isPending: boolean;
  disabled: boolean;
}

export function ShippingPaymentForm({
  form,
  selectedPayment,
  setSelectedPayment,
  onSubmit,
  isPending,
  disabled,
}: ShippingPaymentFormProps) {

    const { zillaOptions, thanaOptions, onZillaSelect } = useAddressSuggestion();

const orderForOptions = [
  { label: "Self", value: "self" },
  { label: "Gift", value: "gift" },
];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 shadow-lg border p-4 rounded-xl">
        <h4 className="font-medium mb-3">Shipping Address</h4>

<div className="grid grid-cols-1 sm:grid-cols-2">
      <FormField
          control={form.control}
          name="orderFor"
          render={({ field }) => (
            <CustomForm
              field={field}
              fieldType="select"
              label=""
              placeHolder="Ordering for"
              options={orderForOptions}
            />
          )}
        />
</div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <CustomForm
              field={field}
              fieldType="input"
              inputType="text"
              label=""
              placeHolder="Your Full Name *"
            />
          )}
        />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <CustomForm
              field={field}
              fieldType="input"
              inputType="text"
              label=""
              placeHolder="017********"
              
            />
          )}
        />
</div>



        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <CustomForm
              field={field}
              fieldType="input"
              label=""
              placeHolder="House 12, Road 5, Dhanmondi"
              
            />
          )}
        />
        <div className="grid grid-cols-2 gap-2 ">
       <FormField
          control={form.control}
          name="zilla"
          render={({ field }) => (
            <CustomForm
              field={{
                ...field,
                onChange: (val: string) => {
                  field.onChange(val);
                  form.setValue("thana", ""); 
                  onZillaSelect(val);
                },
              }}
              fieldType="select"
              label=""
              placeHolder="Select District"
              options={zillaOptions}
              searchable
            
            />
          )}
        />
   <FormField
          control={form.control}
          name="thana"
          render={({ field }) => (
            <CustomForm
              field={field}
              fieldType="select"
              label=""
              placeHolder="Select Thana (Opt.)"
              options={thanaOptions}
              searchable
              
            />
          )}
        />

        </div>

<Accordion type="single" collapsible className="rounded-xl border shadow-sm">
  <AccordionItem value="special-note" className="border-none">
    <AccordionTrigger className="px-4 py-3 hover:no-underline">
      <span className="text-sm font-medium">Add Special Note (Optional)</span>
    </AccordionTrigger>
    <AccordionContent className="px-4 py-4">
      <FormField
        control={form.control}
        name="specialNote"
        render={({ field }) => (
          <CustomForm
            field={field}
            fieldType="textarea"
            label=""
            placeHolder="Special note for your order (optional)"
          />
        )}
      />
    </AccordionContent>
  </AccordionItem>
</Accordion>

        <RadioGroup
          value={selectedPayment}
          onValueChange={setSelectedPayment}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-4"
        >
          {paymentMethods.map((method) => (
            <Label
              key={method.id}
              htmlFor={method.id}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-md border p-2 transition-all",
                selectedPayment === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem id={method.id} value={method.id} />
   <method.Icon className="size-6"/>
                <span className="text-sm font-medium">{method.name}</span>
              </div>
            </Label>
          ))}
        </RadioGroup>

        <FormField
          control={form.control}
          name="agreeToReturnPolicy"
          defaultValue={true}
          render={({ field }) => (
            <div className="flex items-start gap-2 mt-4">
              <Checkbox
                id="agreeToReturnPolicy"
                checked={field.value ?? true}
                onCheckedChange={field.onChange}
              />
              <Label
                htmlFor="agreeToReturnPolicy"
                className="text-sm font-normal leading-snug cursor-pointer"
              >
                I have read and agree to the{" "}
                <Link href="/return-policy"  className="underline">
                  Return Policy
                </Link>
              </Label>
            </div>
          )}
        />

<div className="w-full mx-auto max-w-5xl flex items-center">
        <Button
          type="submit"
          className=" mt-4 w-full"
          disabled={!selectedPayment || disabled || isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-spin" /> Placing Order...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FaBagShopping className="w-4 h-4"/>
             Place Order
            </div>
           
          )}
        </Button>
</div>

      </form>
    </Form>
  );
}