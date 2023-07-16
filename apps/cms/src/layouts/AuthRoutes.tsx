import { type Component } from "solid-js";
import { Outlet } from "@solidjs/router";

const PlainFull: Component = () => {
  return (
    <div class="fixed top-0 left-0 bottom-0 right-0 flex">
      <div class="w-full 3xl:w-[40%] 3xl:min-w-[800px] h-full bg-white overflow-y-auto flex items-center justify-center">
        <div class="m-auto px-10 py-20 w-full max-w-[600px]">
          <Outlet />
        </div>
      </div>
      <div class="hidden 3xl:block w-[60%] bg-primary"></div>
    </div>
  );
};

export default PlainFull;
