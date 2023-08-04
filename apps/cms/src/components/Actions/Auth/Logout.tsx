import { Component, JSXElement } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import spawnToast from "@/utils/spawn-toast";
import { clearCookie } from "@/utils/cookie";
// Services
import api from "@/services/api";

interface LogoutProps {
  children: (props: {
    mutate: () => void;
    isLoading: boolean;
    isError: boolean;
  }) => JSXElement;
}

export const Logout: Component<LogoutProps> = (props) => {
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
    <>
      {props.children({
        mutate: logout.mutate,
        isLoading: logout.isLoading,
        isError: logout.isError,
      })}
    </>
  );
};
