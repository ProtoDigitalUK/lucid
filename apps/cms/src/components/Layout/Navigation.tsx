import { Component, createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
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
import NavigationLink from "@/components/Groups/Navigation/NavigationLink";

const Navigation: Component = () => {
  // ----------------------------------
  // Hooks & States

  // ----------------------------------
  // Mutations & Queries
  createQuery(() => ["environments"], {
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

  // ----------------------------------
  // Memos
  const getFirstEnvHref = createMemo(() => {
    // TODO: work out the first link based on collections, forms, menus, etc. in the environment.
    // TODO: If no envrionemtn, take the to the create environment route.
    return `/env/${environment()}/collections`;
  });

  // ----------------------------------
  // Render
  return (
    <div class="h-full flex ">
      {/* Mainbar */}
      <nav class="bg-white w-[70px] h-full flex items-center flex-col border-r border-border overflow-y-auto max-h-screen">
        <ul class="py-5">
          <NavigationLink href="/" icon="dashboard" title="Home" />
          <NavigationLink
            href={getFirstEnvHref()}
            icon="environment"
            title="Environment"
          />
          <NavigationLink href="/media" icon="media" title="Media" />
          <NavigationLink href="/users" icon="users" title="Users" />
          <NavigationLink href="/settings" icon="settings" title="Settings" />
        </ul>
      </nav>
      {/* Sidebar */}
      <EnvironmentBar />
    </div>
  );
};

export default Navigation;
