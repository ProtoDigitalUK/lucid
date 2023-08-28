import T from "@/translations";
import { Component, createEffect, createMemo } from "solid-js";
import { useLocation, useParams } from "@solidjs/router";
// Store
import userStore from "@/store/userStore";
// Services
import api from "@/services/api";
// Store
import { environment, setEnvironment } from "@/store/environmentStore";
// Components
import Navigation from "@/components/Groups/Navigation";

export const NavigationSidebar: Component = () => {
  // ----------------------------------
  // Hooks & States
  const location = useLocation();
  const params = useParams();

  // ----------------------------------
  // Mutations & Queries
  const environments = api.environment.useGetAll({
    queryParams: {},
  });
  const collections = api.environment.collections.useGetAll({
    queryParams: {
      include: {
        bricks: false,
      },
      filters: {
        environment_key: environment,
      },
    },
    enabled: () => environment() !== undefined,
  });

  // ----------------------------------
  // Effects
  createEffect(() => {
    // get env variable from url
    if (params.envKey) {
      const findEnv = environments.data?.data.find(
        (env) => env.key === params.envKey
      );
      if (!findEnv) return;
      setEnvironment(findEnv.key);
    }
  });

  // ----------------------------------
  // Memos
  const getFirstEnvHref = createMemo(() => {
    // work out the first link based on collections, forms, menus, etc. in the environment.
    // If no envrionemtn, take the to the create environment route.
    if (!environment()) return "/env/create";

    let url = `/env/${environment()}/`;

    if (collections.data?.data.length) {
      url += `collection/${collections.data?.data[0].key}`;
      return url;
    }

    return url;
  });

  // ----------------------------------
  // Render
  return (
    <div class="h-full flex ">
      {/* Mainbar */}
      <nav class="bg-container w-[70px] h-full flex items-center flex-col border-r border-border overflow-y-auto max-h-screen">
        <div class="h-[60px] min-h-[70px] flex items-center justify-center">
          <img
            src="https://placehold.co/100x100/6554FB/white"
            alt="logo"
            class="h-10 w-10 rounded-full"
          />
        </div>
        <ul class="pb-15">
          <Navigation.IconLink href="/" icon="dashboard" title={T("home")} />
          <Navigation.IconLink
            href={getFirstEnvHref()}
            icon="environment"
            title={T("environment")}
            active={location.pathname.includes("/env/")}
          />
          <Navigation.IconLink href="/media" icon="media" title={T("media")} />
          <Navigation.IconLink
            href="/users"
            icon="users"
            title={T("users")}
            permission={
              userStore.get.hasPermission([
                "create_user",
                "update_user",
                "delete_user",
              ]).some
            }
          />
          <Navigation.IconLink
            href="/roles"
            icon="roles"
            title={T("roles")}
            permission={
              userStore.get.hasPermission([
                "create_role",
                "update_role",
                "delete_role",
              ]).some
            }
          />
          <Navigation.IconLink
            href="/settings"
            icon="settings"
            title={T("settings")}
          />
        </ul>
      </nav>
      {/* Sidebar */}
      <Navigation.EnvironmentBar
        collections={collections.data?.data || []}
        environments={environments.data?.data || []}
      />
    </div>
  );
};
