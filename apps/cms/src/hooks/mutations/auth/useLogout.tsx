import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import spawnToast from "@/utils/spawn-toast";
import { clearCookie } from "@/utils/cookie";
// Services
import api from "@/services/api";

export const useLogout = () => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();

  // ----------------------------------------
  // Queries / Mutations
  const logout = createMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      spawnToast({
        title: "Logout successful",
        message: "You have been logged out",
        status: "success",
      });
      navigate("/login");
    },
    onError: () => {
      clearCookie("auth");
      navigate("/login");
    },
  });

  // ----------------------------------------
  // Return
  return {
    action: logout,
  };
};
