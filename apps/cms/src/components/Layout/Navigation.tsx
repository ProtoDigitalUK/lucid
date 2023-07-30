import { Component, createEffect, createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { useLocation, useParams } from "@solidjs/router";
// Utils
import spawnToast from "@/utils/spawn-toast";
// Services
import api from "@/services/api";
// State
import {
  environment,
  setEnvironment,
  syncEnvironment,
} from "@/state/environment";
// Components
import EnvironmentBar from "@/components/Groups/Navigation/EnvironmentBar";
import NavigationIconLink from "@/components/Groups/Navigation/NavigationIconLink";

const Navigation: Component = () => {
  // ----------------------------------
  // Hooks & States
  const location = useLocation();
  const params = useParams();

  // ----------------------------------
  // Mutations & Queries
  const environments = createQuery(() => ["environments.getAll"], {
    queryFn: () => api.environments.getAll(),
    onSuccess: (data) => {
      syncEnvironment(data.data);
    },
    onError: () => {
      setEnvironment(undefined);
      spawnToast({
        status: "error",
        title: "Environment Error",
        message: "There was an error while setting the environment.",
      });
    },
  });
  const collections = createQuery(
    () => ["environments.collections.getAll", environment()],
    {
      queryFn: () =>
        api.environments.collections.getAll({
          include: {
            bricks: false,
          },
          filters: {
            environment_key: environment() as string,
          },
        }),
      enabled: environment() !== undefined,
    }
  );

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
          <NavigationIconLink href="/" icon="dashboard" title="Home" />
          <NavigationIconLink
            href={getFirstEnvHref()}
            icon="environment"
            title="Environment"
            active={location.pathname.includes("/env/")}
          />
          <NavigationIconLink href="/media" icon="media" title="Media" />
          <NavigationIconLink href="/users" icon="users" title="Users" />
          <NavigationIconLink
            href="/settings"
            icon="settings"
            title="Settings"
          />
        </ul>
      </nav>
      {/* Sidebar */}
      <EnvironmentBar
        collections={collections.data?.data || []}
        environments={environments.data?.data || []}
      />
    </div>
  );
};

export default Navigation;
