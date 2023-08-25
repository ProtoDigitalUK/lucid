import { Component, Switch, Match } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
// Store
import userStore from "@/store/userStore";

const AuthLocked: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <Switch fallback={<Outlet />}>
      <Match when={userStore.get.isAuthenticated()}>
        <Navigate href="/" />
      </Match>
    </Switch>
  );
};

export default AuthLocked;
