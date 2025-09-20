"use client";

import { CheckCircle2, TriangleAlert, Zap } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { CustomForm } from "@/components/ui/custom-form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {useRouter } from "next/navigation";
import { z } from "zod";
import { CardContent} from "@/components/ui/card";


const emailSchema = z.object({
  email: z.string().email("একটি সঠিক ইমেল ঠিকানা দিন"),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });


type EmailInput = z.infer<typeof emailSchema>;
type PasswordInput = z.infer<typeof passwordSchema>;

interface Props {
    token?:string;
}

export const ForgotPasswordForm = ({token}:Props) => {

     const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
   const [error, setError] = useState("");

  const emailForm = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });


    
const handleSendResetLink = async (values: EmailInput) => {
  setIsLoading(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/user/forgot-password`, {
      method: "POST",
      body: JSON.stringify(values),
    });
  
  const data = await res.json()

    if(res.status === 200){
      setSuccess(data.message)
      setError("")
    } else {
      setError(data.message)
      setSuccess("")
    }
    emailForm.reset();
  } catch (err) {
    console.error("Fetch error:", err);
    toast.error("Network or CORS error. Failed to send reset link.");
  } finally {
    setIsLoading(false);
  }
};



  const handleResetPassword = async (values: PasswordInput) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await res.json();
      toast.success(data.message);
      passwordForm.reset()
      router.push("/sign-up");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

    return (
                <CardContent>
          {token ? (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      inputType="password"
                      label="New Password"
                      placeHolder="********"
                      allowShowHidePassword
                      important
                    />
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      inputType="password"
                      label="Confirm Password"
                      placeHolder="********"
                      allowShowHidePassword
                      important
                    />
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 animate-spin" />
                      Resetting...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleSendResetLink)} className="space-y-6">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <CustomForm
                      field={field}
                      fieldType="input"
                      inputType="email"
                      label="Email Address"
                      placeHolder="you@example.com"
                      important
                    />
                  )}
                />
                {success && <p className="text-green-600 flex gap-x-2 items-center text-sm font-semibold"><CheckCircle2 className="size-4"/> {success}</p>}
                {error && <p className="text-destructive flex gap-x-2 items-center text-sm font-semibold"><TriangleAlert className="size-4"/> {error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
    )
}