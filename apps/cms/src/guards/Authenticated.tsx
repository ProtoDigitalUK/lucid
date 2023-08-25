import { Component, Switch, Match } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
// State
import userStore from "@/store/userStore";

interface AuthenticatedProps {
  requiredState?: boolean;
}

const Authenticated: Component<AuthenticatedProps> = () => {
  // ----------------------------------------
  // Render
  return (
    <Switch fallback={<Outlet />}>
      <Match when={userStore.get.isAuthenticated() === false}>
        <Navigate href="/login" />
      </Match>
    </Switch>
  );
};

export default Authenticated;
