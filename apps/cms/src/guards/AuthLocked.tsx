import { Component, Switch, Match } from "solid-js";
import { getCookie } from "@/utils/cookie";
import { Navigate, Outlet } from "@solidjs/router";

const AuthLocked: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <Switch fallback={<Outlet />}>
      <Match when={getCookie("auth")}>
        <Navigate href="/" />
      </Match>
    </Switch>
  );
};

export default AuthLocked;
