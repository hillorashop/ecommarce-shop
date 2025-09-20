"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormField} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // optional toast for feedback
import { CustomForm } from "@/components/ui/custom-form";
import { useState } from "react";
import { CheckCircle2, TriangleAlert, Zap } from "lucide-react";


interface Props {
  tabValue: string;
  disable?: boolean;
  userId:string
}

export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(2, "Current Password আবশ্যক"),
    newPassword: z
      .string()
      .min(5, "New Password অবশ্যই কমপক্ষে 5 অক্ষর হতে হবে"),
    confirmPassword: z
      .string()
      .min(5, "New Password নিশ্চিত করুন"),
  })
  // নতুন পাসওয়ার্ড আর নিশ্চিতকরণ পাসওয়ার্ড মিল আছে কিনা
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New Passowd এবং Confirm Password মিলছে না",
    path: ["confirmPassword"],
  })
  // বর্তমান পাসওয়ার্ড আর নতুন পাসওয়ার্ড যেন এক না হয়
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Current Password এবং New Passowd এক হতে পারবে না",
    path: ["newPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordMangement = ({ tabValue, disable, userId }: Props) => {

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });


  const handlePassword = async (values: PasswordFormValues) => {
  setIsLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/user/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: values.newPassword,
          oldPassword: values.currentPassword,
          userId,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      // status 200-299
      setSuccess(data.message || "Password updated successfully");
      toast.success(data.message || "Password updated successfully");
      form.reset();
    } else {
      // status 400, 404, 500 etc
      setError(data.message || "Something went wrong");
      toast.error(data.message || "Something went wrong");
    }
  } catch (err) {
    console.error("Change password error:", err);
    setError("Something went wrong");
    toast.error("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};




  return (
    <TabsContent value={tabValue}>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Password Management</CardTitle>
  {disable && (
  <CardDescription className="text-sm text-destructive flex items-start gap-x-2 ">
    <TriangleAlert className="size-6"/> এই ফিল্ডটি বর্তমানে বন্ধ রয়েছে, কারণ আপনি Google বা Facebook দিয়ে লগইন করেছেন।  
    আপনার কোনো পাসওয়ার্ড সেট করা নেই, তাই এটি ব্যবহার করা যাচ্ছে না।
  </CardDescription>
)}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePassword)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                 <CustomForm
                                   field={field}
                                   fieldType="input"
                                   inputType="password"
                                   label="Current Password"
                                   placeHolder="*****"
                                   allowShowHidePassword
                                   important
                                   disable={disable}
                                 />
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
              <CustomForm
                      field={field}
                      fieldType="input"
                      inputType="password"
                      label="New Password"
                      placeHolder="*****"
                      allowShowHidePassword
                      important
                      disable={disable}
                    />
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
           <CustomForm
                      field={field}
                      fieldType="input"
                      inputType="password"
                      label="Confirm Password"
                      placeHolder="*****"
                      allowShowHidePassword
                      important
                      disable={disable}
                    />
                )}
              />

              {error && <p className="text-destructive flex items-center gap-x-2"><TriangleAlert className="size-4"/> {error}</p>}
              {success && <p className="text-green-600 flex items-center gap-x-2"><CheckCircle2 className="size-4"/> {success}</p>}

              <Button type="submit" disabled={isLoading || disable}>
                   {isLoading ? (
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 animate-spin" />
        Updating...
      </div>
    ) : (
      "Update Password"
    )}
                    
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
