import { Component, Switch, Match } from "solid-js";
import { Outlet } from "@solidjs/router";
// Services
import api from "@/services/api";
// Components
import Layout from "@/components/Groups/Layout";

const MainLayout: Component = () => {
  // ------------------------------------------------------
  // State & Hooks
  const authenticatedUser = api.auth.useGetAuthenticatedUser({
    queryParams: {},
  });

  // ------------------------------------------------------
  // Render
  return (
    <div class="grid grid-cols-main-layout fixed inset-0">
      <Layout.NavigationSidebar />
      <main class="overflow-y-auto">
        <Switch>
          <Match when={authenticatedUser.isSuccess}>
            <Outlet />
          </Match>
          <Match when={authenticatedUser.isLoading}>
            <div class="flex items-center justify-center fixed inset-0 bg-red-600">
              <div class="text-2xl font-bold text-white">Loading...</div>
            </div>
          </Match>
        </Switch>
      </main>
    </div>
  );
};

export default MainLayout;
