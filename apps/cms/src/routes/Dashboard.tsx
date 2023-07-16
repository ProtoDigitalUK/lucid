import type { Component } from "solid-js";
import { Link } from "@solidjs/router";

const DashboardRoute: Component = () => {
  return (
    <div>
      <h1 class="text-6xl font-bold text-red-700">App</h1>
      <Link href="/login">Login</Link>
    </div>
  );
};

export default DashboardRoute;
