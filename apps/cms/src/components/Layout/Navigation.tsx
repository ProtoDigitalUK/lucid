import { Component } from "solid-js";
// Components
import EnvironmentBar from "@/components/Groups/Navigation/EnvironmentBar";
import { Link } from "@solidjs/router";

const Navigation: Component = () => {
  return (
    <div class="h-full flex">
      {/* Mainbar */}
      <div class="bg-error w-[70px] h-full">
        <Link href="/" class="w-10 h-10 bg-blue-400 block">
          H
        </Link>
        <Link
          href="/env/site-prod/collections"
          class="w-10 h-10 bg-blue-400 block"
        >
          C
        </Link>
      </div>
      {/* Sidebar */}
      <EnvironmentBar />
    </div>
  );
};

export default Navigation;
