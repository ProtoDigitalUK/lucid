import { Component } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
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
      text="Logout"
      type="submit"
      colour="primary"
      loading={logout.isLoading}
      onCLick={() => {
        logout.mutate();
      }}
    />
  );
};

export default LogoutButton;
