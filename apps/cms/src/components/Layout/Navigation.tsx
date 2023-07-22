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
    <div class="h-full flex">
      {/* Mainbar */}
      <div class="bg-white w-[70px] h-full flex items-center flex-col py-5 border-r border-border">
        <NavigationLink href="/" icon="dashboard" />
        <NavigationLink href={getFirstEnvHref()} icon="environment" />
        <NavigationLink href="/media" icon="media" />
        <NavigationLink href="/users" icon="users" />
        <NavigationLink href="/settings" icon="settings" />
      </div>
      {/* Sidebar */}
      <EnvironmentBar />
    </div>
  );
};

export default Navigation;
