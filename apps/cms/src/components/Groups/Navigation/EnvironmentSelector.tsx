import { Component, createMemo, createSignal, For } from "solid-js";
import classNames from "classnames";
import { useNavigate, useLocation, useParams } from "@solidjs/router";
// State
import { environment, setEnvironment } from "@/state/environment";
// Types
import { EnvironmentResT } from "@lucid/types/src/environments";
// Components
import { FaSolidPlus } from "solid-icons/fa";
import { DropdownMenu, Separator } from "@kobalte/core";
import { FaSolidChevronRight } from "solid-icons/fa";
import Link from "@/components/Partials/Link";

interface EnvironmentSelectorProps {
  environments: EnvironmentResT[];
}

const EnvironmentSelector: Component<EnvironmentSelectorProps> = (props) => {
  // ----------------------------------
  // Hooks & States
  const [open, setOpen] = createSignal(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // ----------------------------------
  // Memos
  const environmentData = createMemo(() => {
    return props.environments.find((env) => env.key === environment());
  });

  // ----------------------------------
  // Functions
  const changeEnvironment = (envKey: string) => {
    if (params.envKey !== undefined) {
      let newPath = location.pathname.replace(
        /\/env\/[a-z-_]+/,
        `/env/${envKey}`
      );
      navigate(newPath, { replace: true });
    } else {
      setEnvironment(envKey);
    }
  };

  // ----------------------------------
  // Render
  return (
    <DropdownMenu.Root open={open()} onOpenChange={setOpen}>
      <DropdownMenu.Trigger class="relative h-[60px] w-full bg-white border-b border-border mb-[15px] flex items-center justify-between px-[15px] focus:outline-none focus:ring-2 ring-secondary">
        <span class="text-title font-medium">{environmentData()?.title}</span>
        <FaSolidChevronRight
          class={classNames("fill-title transition-all duration-200", {
            "transform rotate-90": open(),
          })}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="bg-primary w-[240px] p-[15px] shadow-md animate-animate-dropdown focus:outline-none focus:ring-2 ring-secondary">
          <ul>
            <For each={props.environments}>
              {(env) => (
                <li class="mb-1.5 last:mb-0">
                  <button
                    type="button"
                    class={
                      "text-base text-primaryText w-full text-left flex h-5 group "
                    }
                    onClick={() => changeEnvironment(env.key)}
                  >
                    <span
                      class={classNames(
                        "h-full w-1 rounded-full block mr-2.5 group-hover:bg-secondaryH duration-200 transition-colors",
                        {
                          "bg-secondary": env.key === environment(),
                          "bg-primaryA": env.key !== environment(),
                        }
                      )}
                    ></span>
                    {env.title}
                  </button>
                </li>
              )}
            </For>
          </ul>
          <Separator.Root class="border-primaryA my-2.5 w-full" />
          <Link href="/env/create" theme="primary-slim-outline">
            <FaSolidPlus class="mr-2" />
            Create Environment
          </Link>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default EnvironmentSelector;
