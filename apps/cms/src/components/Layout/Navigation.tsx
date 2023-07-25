import { Component, createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { useLocation } from "@solidjs/router";
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

  // ----------------------------------
  // Mutations & Queries
  createQuery(() => ["environments.getAll"], {
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
  const collections = createQuery(() => ["environments.collections.getAll"], {
    queryFn: () =>
      api.environments.collections.getAll({
        include: {
          bricks: false,
        },
      }),
  });

  // ----------------------------------
  // Memos
  const getFirstEnvHref = createMemo(() => {
    // work out the first link based on collections, forms, menus, etc. in the environment.
    // If no envrionemtn, take the to the create environment route.
    let url = `/env/${environment()}/`;

    if (collections.data?.data.length) {
      url += `collection/${collections.data?.data[0].key}`;
      return url;
    }

    return `${url}create`;
  });

  // ----------------------------------
  // Render
  return (
    <div class="h-full flex ">
      {/* Mainbar */}
      <nav class="bg-white w-[70px] h-full flex items-center flex-col border-r border-border overflow-y-auto max-h-screen">
        <ul class="py-5">
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
      <EnvironmentBar collections={collections.data?.data || []} />
    </div>
  );
};

export default Navigation;
