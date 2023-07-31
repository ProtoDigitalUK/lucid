import {
  Component,
  createSignal,
  createEffect,
  onCleanup,
  Switch,
  Match,
} from "solid-js";
import { toast, Toast } from "solid-toast";
import classNames from "classnames";
import {
  FaSolidTriangleExclamation,
  FaSolidCheck,
  FaSolidExclamation,
  FaSolidInfo,
} from "solid-icons/fa";

interface CustomToastProps {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  toast: Toast;
  duration?: number;
}

const CustomToast: Component<CustomToastProps> = (props) => {
  // ----------------------------------------
  // State
  const duration = props.duration || 5000;
  const [life, setLife] = createSignal(100);
  const startTime = Date.now();

  // ----------------------------------------
  // Effects
  createEffect(() => {
    if (props.toast.paused) return;
    const interval = setInterval(() => {
      const diff = Date.now() - startTime - props.toast.pauseDuration;

      const percentage = (diff / duration) * 100;
      if (percentage <= 100) setLife(percentage);
    });

    onCleanup(() => clearInterval(interval));
  });

  // ----------------------------------------
  // Render
  return (
    <div
      class={classNames(
        "bg-container rounded-md p-3 drop-shadow-md w-[400px] relative overflow-hidden",
        {
          "animate-enter": props.toast.visible,
          "animate-leave": !props.toast.visible,
        }
      )}
    >
      <div class="z-10 relative flex pr-10">
        <span
          class={classNames(
            "w-6 h-6 flex items-center justify-center rounded-full min-w-[24px]",
            {
              "bg-success": props.type === "success",
              "bg-error": props.type === "error",
              "bg-warning": props.type === "warning",
              "bg-secondary": props.type === "info",
            }
          )}
        >
          <Switch>
            <Match when={props.type === "success"}>
              <FaSolidCheck class="fill-white w-3 h-3 m-auto" />
            </Match>
            <Match when={props.type === "error"}>
              <FaSolidExclamation class="fill-white w-3 h-3 m-auto" />
            </Match>
            <Match when={props.type === "warning"}>
              <FaSolidTriangleExclamation class="fill-body w-3 h-3 m-auto" />
            </Match>
            <Match when={props.type === "info"}>
              <FaSolidInfo class="fill-white w-3 h-3 m-auto" />
            </Match>
          </Switch>
        </span>
        <div class="ml-2.5">
          <p class="text-sm font-bold mb-1">{props.title}</p>
          <p class="text-sm">{props.message}</p>
        </div>
      </div>
      <button
        class="bg-backgroundAccent hover:bg-backgroundAccentH flex justify-center top-1/2 -translate-y-1/2 items-center w-6 h-6 right-2.5 absolute rounded-full z-20 hover:text-error duration-200 transition-all shadow-md"
        onClick={() => toast.dismiss(props.toast.id)}
      >
        &times;
      </button>
      {/* Bakground duration bar */}
      <span
        class="inset-0 absolute bg-border opacity-50 z-0"
        style={{ width: `${life()}%` }}
      ></span>
    </div>
  );
};

export default CustomToast;