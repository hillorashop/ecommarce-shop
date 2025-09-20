export type userInput = {
  name?: string;
  mobileNumber?: string;
  address?: string;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  address: string | null;
  mobileNumber: string | null;
  image: string | null;
  role: "GOOGLE" | "FACEBOOK" | "USER";
};

export type UserResponse = {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
};

// ✅ Fetch user profile
export const getUser = async (token?:string): Promise<UserResponse> => {
  try {

    if (!token) return { success: false, error: "No token found" };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/user/get-profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.error || "Failed to fetch user" };
    }

    const data = await res.json();
    return { success: true, user: data.user };
  } catch (err: any) {
    console.error("Get user error:", err.message);
    return { success: false, error: "Failed to fetch user" };
  }
};

// ✅ Update user profile
export const updateUser = async (data: userInput): Promise<UserResponse> => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return { success: false, error: "No token found" };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/user/update-profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.error || "Failed to update user" };
    }

    const resData = await res.json();
    return {
      success: true,
      user: resData.user,
      message: resData.message,
    };
  } catch (err: any) {
    console.error("Update user error:", err.message);
    return { success: false, error: "Failed to update user" };
  }
};
