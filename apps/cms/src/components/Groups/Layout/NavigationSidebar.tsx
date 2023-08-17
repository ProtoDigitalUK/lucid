import { Component, createEffect, createMemo } from "solid-js";
import { useLocation, useParams } from "@solidjs/router";
// Services
import api from "@/services/api";
// State
import { environment, setEnvironment } from "@/state/environment";
// Components
import Navigation from "@/components/Groups/Navigation";

export const NavigationSidebar: Component = () => {
  // ----------------------------------
  // Hooks & States
  const location = useLocation();
  const params = useParams();

  // ----------------------------------
  // Mutations & Queries
  const environments = api.environments.useGetAll({
    queryParams: {},
  });
  const collections = api.environments.collections.useGetAll({
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
          <Navigation.IconLink href="/" icon="dashboard" title="home" />
          <Navigation.IconLink
            href={getFirstEnvHref()}
            icon="environment"
            title="environment"
            active={location.pathname.includes("/env/")}
          />
          <Navigation.IconLink href="/media" icon="media" title="media" />
          <Navigation.IconLink href="/users" icon="users" title="users" />
          <Navigation.IconLink
            href="/settings"
            icon="settings"
            title="settings"
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
