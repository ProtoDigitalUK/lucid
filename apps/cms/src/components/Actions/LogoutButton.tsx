import { Component } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import spawnToast from "@/utils/spawn-toast";
import { clearCookie } from "@/utils/cookie";
// Services
import api from "@/services/api";
// Components
import Button from "@/components/Partials/Button";

interface LogoutButtonProps {}

const LogoutButton: Component<LogoutButtonProps> = () => {
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
  // Render
  return (
    <Button
      type="submit"
      theme="primary"
      size="medium"
      loading={logout.isLoading}
      onCLick={() => {
        logout.mutate();
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
