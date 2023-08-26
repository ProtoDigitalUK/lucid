import { Component, Switch, Match } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
import { getCookie } from "@/utils/cookie";

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
