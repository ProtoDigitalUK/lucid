import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import spawnToast from "@/utils/spawn-toast";
import { clearCookie } from "@/utils/cookie";
import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";

export const logoutReq = () => {
  return request<
    APIResponse<{
      message: string;
    }>
  >({
    url: `/api/v1/auth/logout`,
    config: {
      method: "POST",
    },
  });
};

const useLogout = () => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();

  // ----------------------------------------
  // Queries / Mutations
  const logout = createMutation({
    mutationFn: logoutReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: "Logout successful",
          message: "You have been logged out",
          status: "success",
        });
        navigate("/login");
      } else if (error) {
        clearCookie("auth");
        navigate("/login");
      }
    },
  });

  // ----------------------------------------
  // Return
  return {
    action: logout,
  };
};

export default useLogout;
