import { Component } from "solid-js";

export const Builder: Component = () => {
  // ----------------------------------
  // Render
  return (
    <div class="m-auto max-w-3xl w-full">
      {/* Fixed Top Zone */}
      <div>fixed top</div>
      {/* Builder Zone */}
      <div class="my-20">
        <div class="w-full h-10 bg-white bg-opacity-40 mb-15 last:mb-0 rounded-md">
          Banner
        </div>
        <div class="w-full h-10 bg-white bg-opacity-40 mb-15 last:mb-0 rounded-md">
          Introduction
        </div>
      </div>
      {/* Fixed Bottom/Sidebar Zone */}
      <div>fixed bottom</div>
    </div>
  );
};

export default Builder;
