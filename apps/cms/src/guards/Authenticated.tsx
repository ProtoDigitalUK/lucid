import { Component, Switch, Match } from "solid-js";
import { getCookie } from "@/utils/cookie";
import { Navigate, Outlet } from "@solidjs/router";

interface AuthenticatedProps {
  requiredState?: boolean;
}

const Authenticated: Component<AuthenticatedProps> = () => {
  // ----------------------------------------
  // Render
  return (
    <Switch fallback={<Outlet />}>
      <Match when={!getCookie("auth")}>
        <Navigate href="/" />
      </Match>
    </Switch>
  );
};

export default Authenticated;
