import T from "@/translations";
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
          title: T("logout_success_toast_title"),
          message: T("logout_success_toast_message"),
          status: "success",
        });
        navigate("/login");
        sessionStorage.removeItem("_csrf");
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
    reset: () => {
      logout.reset();
    },
  };
};

export default useLogout;
