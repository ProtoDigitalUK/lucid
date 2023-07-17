import { Component } from "solid-js";
import { getCookie } from "@/utils/cookie";
import { Navigate, Outlet } from "@solidjs/router";

interface AuthenticatedProps {
  requiredState?: boolean;
}

const Authenticated: Component<AuthenticatedProps> = ({ requiredState }) => {
  if (!getCookie("auth")) {
    return <Navigate href="/login" />;
  }

  return <Outlet />;
};

export default Authenticated;
