import { Component, For } from "solid-js";
import classNames from "classnames";
import { FaSolidBacon } from "solid-icons/fa";

const items = [
  {
    title: "Create a List",
    description: "Another to-do system you’ll try but eventually give up on.",
    background: "bg-pink-500",
  },
  {
    title: "Create a Calendar",
    description: "Stay on top of your deadlines, or don’t — it’s up to you.",
    background: "bg-yellow-500",
  },
  {
    title: "Create a Gallery",
    description: "Great for mood boards and inspiration.",
    background: "bg-green-500",
  },
  {
    title: "Create a Board",
    description: "Track tasks in different stages of your project.",
    background: "bg-blue-500",
  },
  {
    title: "Create a Spreadsheet",
    description: "Lots of numbers and things — good for nerds.",
    background: "bg-indigo-500",
  },
  {
    title: "Create a Timeline",
    description: "Get a birds-eye-view of your procrastination.",
    background: "bg-purple-500",
  },
  {
    title: "Create a Board",
    description: "Track tasks in different stages of your project.",
    background: "bg-blue-500",
  },
  {
    title: "Create a Spreadsheet",
    description: "Lots of numbers and things — good for nerds.",
    background: "bg-indigo-500",
  },
  {
    title: "Create a Timeline",
    description: "Get a birds-eye-view of your procrastination.",
    background: "bg-purple-500",
  },
];

const StartingPoints: Component = () => {
  // ------------------------------------
  // Render
  return (
    <div class="mb-30">
      <ul
        role="list"
        class="grid grid-cols-1 gap-6 pb-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <For each={items}>
          {(item) => (
            <li class="flow-root">
              <div class="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
                <div
                  class={classNames(
                    item.background,
                    "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg"
                  )}
                >
                  <FaSolidBacon class="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">
                    <a href="#" class="focus:outline-none">
                      <span class="absolute inset-0" aria-hidden="true" />
                      <span>{item.title}</span>
                      <span aria-hidden="true"> &rarr;</span>
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </li>
          )}
        </For>
      </ul>
      <div class="mt-4 flex">
        <a
          href="#"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Or start from an empty project
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default StartingPoints;
