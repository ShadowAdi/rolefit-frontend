import axiosInstance from "@/api/axios-instance";

export const loginUaser = async () => {
  const response = await axiosInstance.post("/auth/login");
  const data = await response.data;

  if (data.Success) {
    return {
      user: {
        email: data.email,
        id: data.id,
      },
      success: data.Success,
      message: data.message,
      access_token: data.access_token,
      expires_in: data.expires_in,
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
