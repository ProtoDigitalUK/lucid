import request from "@/utils/request";

const logout = () => {
  return request<
    APIResponse<{
      message: string;
    }>
  >(`/api/v1/auth/logout`, {
    method: "POST",
  });
};

export default logout;
