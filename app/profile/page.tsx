"use client";

import {
  Loader2,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  Zap,
  LockIcon,
  RotateCcw,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { CustomForm } from "@/components/ui/custom-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/zod-schema";
import { updateUser, userInput } from "@/actions/user";
import { UserOrderList } from "./_components/user-order-list";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import z from "zod";
import { PasswordMangement } from "./_components/password-mangement";
import { useUpdateUser } from "@/hooks/use-user";


const ProfilePage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const { user, loaded, setUser, logout } = useUser();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      address: "",
    },
  });

  const { mutate: updateProfile, isPending } = useUpdateUser();

  useEffect(() => {
    if (!loaded) return;
    if (!user) {
      router.replace("/sign-up");
    } else {
      profileForm.reset({
        name: user.name ?? "",
        mobileNumber: user.mobileNumber ?? "",
        address: user.address ?? "",
      });
    }
  }, [user, loaded, profileForm, router]);

  const handleProfile = (data: userInput) => {
    updateProfile(data, { onSuccess: () => setIsEdit(false) });
  };
  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
    router.push("/");
  };

  // ✅ Show loader while checking auth
  if (!loaded || !user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { value: "profile", label: "Profile", icon: UserIcon },
    { value: "orders", label: "Orders", icon: ShoppingBag },
    { value: "password", label: "Password Management", icon: LockIcon },
  
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-3 sm:px-6">
      <Card className="shadow-xl rounded-2xl border border-gray-200">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">
            My Account
          </CardTitle>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" /> Logout
          </Button>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Tabs
            defaultValue="profile"
            className="w-full flex flex-col md:grid md:grid-cols-[220px_1fr] gap-4 gap-y-14 md:gap-6"
          >
            <TabsList className="flex flex-wrap md:flex-col gap-2 md:gap-y-3 md:h-fit md:min-w-[200px]">
              {tabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 w-full justify-start text-sm data-[state=active]:shadow-sm"
                >
                  <Icon className="size-4" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEdit ? (
                    <Form {...profileForm}>
                      <form
                        className="space-y-4"
                        onSubmit={profileForm.handleSubmit(handleProfile)}
                      >
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <CustomForm
                              field={field}
                              fieldType="input"
                              inputType="text"
                              label="Name"
                              placeHolder="Enter your full name"
                              important
                            />
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="mobileNumber"
                          render={({ field }) => (
                            <CustomForm
                              field={field}
                              fieldType="input"
                              inputType="text"
                              label="Mobile Number"
                              placeHolder="+880"
                            />
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <CustomForm
                              field={field}
                              fieldType="textarea"
                              label="Address"
                              placeHolder="Enter your address"
                            />
                          )}
                        />

                        <div className="flex items-center justify-between w-full">
                          <Button
                            type="button"
                            onClick={() => setIsEdit(false)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                          <Button
                            className=""
                            type="submit"
                            disabled={isPending}
                          >
                            {isPending ? (
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 animate-spin" />
                                Saving...
                              </div>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="flex flex-col items-center gap-6 p-6 bg-white shadow-sm rounded-xl border border-gray-200">
                      <Avatar className="w-24 h-24 border-2 border-gray-300 shadow-md">
                        {user?.image && (
                          <AvatarImage
                            src={user.image}
                            alt={user?.name || "User Avatar"}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="text-lg font-semibold text-white bg-purple-600">
                          {user?.name
                            ? user.name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="w-full space-y-4 text-center md:text-left">
                        <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-2">
                          <h4 className="text-lg md:text-xl font-bold text-gray-800 tracking-wide">
                            {user?.name}
                          </h4>
                          <p className="text-sm text-muted-foreground font-semibold">
                            {user?.email}
                          </p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-700">
                            {user?.mobileNumber}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 text-pretty wrap-break-word text-center">
                          {user?.address}
                        </p>
                      </div>

                      <Button
                        size={"sm"}
                        onClick={() => setIsEdit(true)}
                        className="flex items-center gap-x-2 bg-green-600 text-white hover:bg-green-700 active:bg-green-600"
                      >
                        <Edit className="size-4" />
                        Edit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
                
            <UserOrderList tabValue="orders" userId={user.id!}/>
            <PasswordMangement tabValue="password" disable={user.role !== "USER"} userId={user.id!}/>
     
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
