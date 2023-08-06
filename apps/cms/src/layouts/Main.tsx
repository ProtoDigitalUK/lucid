import { Component } from "solid-js";
import { Outlet } from "@solidjs/router";
// Components
import Layout from "@/components/Groups/Layout";

const MainLayout: Component = () => {
  // ------------------------------------------------------
  // State & Hooks

  // ------------------------------------------------------
  // Render
  return (
    <div class="grid grid-cols-main-layout fixed inset-0">
      <Layout.NavigationSidebar />
      <main class="overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
