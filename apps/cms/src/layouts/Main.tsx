import { Component, createSignal } from "solid-js";
import { Outlet } from "@solidjs/router";
// Components
import Navigation from "@/components/Layout/Navigation";

const MainLayout: Component = (props) => {
  // ------------------------------------------------------
  // State & Hooks
  const [contentWidth, setContentWidth] = createSignal(0);

  // ------------------------------------------------------
  // Render
  return (
    <div class="grid grid-cols-main-layout fixed inset-0">
      <Navigation />
      <main class="overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
