import { Component, Switch, Match } from "solid-js";
import { Outlet } from "@solidjs/router";
// Services
import api from "@/services/api";
// Components
import Layout from "@/components/Groups/Layout";
// import Spinner from "@/components/Partials/Spinner";

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
            <div class="fixed inset-0 z-50 bg-primary flex items-center justify-center">
              <div class="absolute inset-0 z-20 flex-col flex items-center justify-center">
                {/* <Spinner size="md" /> */}
                <h1 class="text-2xl font-bold text-primaryText mt-5">
                  Loading
                </h1>
              </div>
              {/* shapes */}
              <span
                class="animate-spin absolute inset-0 flex items-center z-10"
                style={{
                  "animation-duration": "5s",
                }}
              >
                <span class="block  border border-border opacity-80 w-full after:pb-[100%] after:block rotate-45 translate-x-1/2" />
              </span>
              <span
                class="animate-spin absolute inset-0 flex items-center z-10"
                style={{
                  "animation-duration": "5s",
                }}
              >
                <span class="block  border border-border opacity-50 w-full after:pb-[100%] after:block rotate-45 translate-x-1/3" />
              </span>
            </div>
          </Match>
        </Switch>
      </main>
    </div>
  );
};

export default MainLayout;
