import type { Component } from "solid-js";
// Components
import LogoutButton from "@/components/Actions/LogoutButton";

const DashboardRoute: Component = () => {
  return (
    <div>
      <h1 class="text-6xl font-bold text-red-700">App</h1>

      <LogoutButton classes=" w-64" />
    </div>
  );
};

export default DashboardRoute;
