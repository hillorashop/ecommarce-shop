import z from "zod";



export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "নামটি অবশ্যই দিতে হবে।" }),
    email: z.string().email({ message: "সঠিক ইমেইল ঠিকানা দিন।" }),
    password: z
      .string()
      .min(4, { message: "পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।" }),
    confirmPassword: z.string().min(1, { message: "পাসওয়ার্ড নিশ্চিত করুন।" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "আপনাকে শর্তাবলী মেনে নিতে হবে",
  }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // 🔥 error will show under confirmPassword field
    message: "পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলে না।",

  });

  

export const logInSchema = z.object({
  email: z.string().email({ message: "সঠিক ইমেইল ঠিকানা দিন।" }),
  password: z.string().min(4, { message: "পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।" }),
});


export const orderFormSchema = z.object({
  paymentMethod: z.string().min(1, "পেমেন্ট মেথড আবশ্যক"),
  isPaid: z.boolean().default(false),
  mobileNumber: z
    .string()
    .min(10, "মোবাইল নাম্বার কমপক্ষে 10 ডিজিট হতে হবে")
    .max(15, "মোবাইল নাম্বার সর্বোচ্চ 15 ডিজিট হতে পারবে")
    .regex(/^\+?[0-9]\d{1,14}$/, "অবৈধ মোবাইল নাম্বার"),
  address: z.string().min(5, "ঠিকানা কমপক্ষে 5 অক্ষরের হতে হবে"),
});

// ✅ Order Item Form Schema
export const orderItemFormSchema = z.object({
  orderId: z.string().min(1, "অর্ডার আইডি আবশ্যক"),
  productId: z.string().min(1, "প্রোডাক্ট আইডি আবশ্যক"),
});

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "নাম আবশ্যক" })
    .max(20, { message: "নাম ২০ অক্ষরের বেশি হতে পারবে না" }),

  mobileNumber: z
    .string()
   .min(10, "মোবাইল নাম্বার কমপক্ষে 10 ডিজিট হতে হবে")
    .max(15, "মোবাইল নাম্বার সর্বোচ্চ 15 ডিজিট হতে পারবে")
    .regex(/^\+?[0-9]\d{1,14}$/, "অবৈধ মোবাইল নাম্বার"),

  address: z
    .string()
    .min(5, { message: "ঠিকানা আবশ্যক" })
});


export const businessFormSchema = z.object({
  // personal
  businessName: z.string().min(2, "ব্যবসার নাম আবশ্যক"),
  firstName: z.string().min(2, "প্রথম নাম আবশ্যক"),
  lastName: z.string().min(2, "শেষ নাম আবশ্যক"),
  email: z.string().email("সঠিক ইমেইল প্রদান করুন"),
  mobileNumber: z
    .string()
    .min(10, "মোবাইল নাম্বার কমপক্ষে 10 ডিজিট হতে হবে")
    .max(15, "মোবাইল নাম্বার সর্বোচ্চ 15 ডিজিট হতে পারবে")
    .regex(/^\+?[0-9]\d{9,14}$/, "অবৈধ মোবাইল নাম্বার"),

  // business
  businessType: z.string().min(1, "ব্যবসার ধরন আবশ্যক"),
  description: z.string().min(10, "বর্ণনা কমপক্ষে 10 অক্ষরের হতে হবে"),
  division: z.string().min(2, "বিভাগের নাম আবশ্যক"),
  district: z.string().min(2, "জেলার নাম আবশ্যক"),
  subDistrict: z.string().min(2, "উপজেলার নাম আবশ্যক"),
  zipCode: z
    .string()
    .min(4, "পোস্টকোড কমপক্ষে 4 সংখ্যার হতে হবে")
    .max(10, "পোস্টকোড সর্বোচ্চ 10 সংখ্যার হতে পারবে")
    .regex(/^[0-9]+$/, "অবৈধ পোস্টকোড"),
  address: z.string().min(5, "ঠিকানা কমপক্ষে 5 অক্ষরের হতে হবে"),

  // agreements
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "আপনাকে শর্তাবলী মেনে নিতে হবে",
  }),
});