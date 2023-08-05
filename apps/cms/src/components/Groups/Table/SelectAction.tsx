import { Component } from "solid-js";
// Components
import Button from "@/components/Partials/Button";

interface SelectActionProps {
  data: {
    selected: number;
  };
  callbacks: {
    reset: () => void;
    delete: () => void;
  };
}

export const SelectAction: Component<SelectActionProps> = (props) => {
  // ----------------------------------------
  // Render
  return (
    <div class="sticky bottom-0 left-0 right-0 flex justify-center items-center z-50 py-30 pointer-events-none px-15">
      <div class="pointer-events-auto bg-container py-3 px-5 shadow-md border border-border rounded-full max-w-[400px] w-full justify-between flex items-center">
        <p class="text-sm">
          <span class="font-bold">
            {props.data.selected > 1
              ? `${props.data.selected} items`
              : "1 item"}
          </span>{" "}
          selected
        </p>
        <div class="ml-15 flex">
          <Button
            theme="container-outline"
            size="x-small"
            classes="!py-1"
            onClick={props.callbacks.reset}
          >
            reset
          </Button>
          <Button
            classes="ml-2.5 !py-1"
            theme="danger"
            size="x-small"
            onClick={props.callbacks.delete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
