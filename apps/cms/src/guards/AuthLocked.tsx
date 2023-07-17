import { Component } from "solid-js";
import { getCookie } from "@/utils/cookie";
import { Navigate, Outlet } from "@solidjs/router";

const AuthLocked: Component = () => {
  if (getCookie("auth")) {
    return <Navigate href="/" />;
  }

  return <Outlet />;
};

export default AuthLocked;
