import axiosInstance from "@/api/axios-instance";

export const registerUser = async () => {
  const response = await axiosInstance.post("/user/register");
  const data = await response.data;

  if (data.Success) {
    return {
      user: {
        email: data.user.email,
        id: data.user.id,
        createdAt: data.user.created_at,
      },
      success: data.Success,
      message: data.message,
    };
  } else {
    return {
      success: data.success,
      message: data.message,
      detail: data.detail,
      error: data.error,
    };
  }
};
