import { Component, createMemo, For } from "solid-js";
import classNames from "classnames";
import { Link, useNavigate, useLocation, useParams } from "@solidjs/router";
// State
import { environment, setEnvironment } from "@/state/environment";
// Types
import { EnvironmentResT } from "@lucid/types/src/environments";
// Components
import { DropdownMenu, Separator } from "@kobalte/core";
import { FaSolidChevronRight } from "solid-icons/fa";

interface EnvironmentSelectorProps {
  environments: EnvironmentResT[];
}

const EnvironmentSelector: Component<EnvironmentSelectorProps> = (props) => {
  // ----------------------------------
  // Hooks & States
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
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger class="relative h-[60px] w-full bg-white border-b border-border mb-[15px] flex items-center justify-between px-[15px]">
        <span class="text-title font-medium">{environmentData()?.title}</span>
        <FaSolidChevronRight class="fill-title" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="bg-primary w-[240px] p-[15px] shadow-md animate-animate-dropdown">
          <ul>
            <For each={props.environments}>
              {(env) => (
                <li class="mb-1.5 last:mb-0">
                  <button
                    class={
                      "text-base text-primaryText w-full text-left flex h-5"
                    }
                    onClick={() => changeEnvironment(env.key)}
                  >
                    <span
                      class={classNames(
                        "h-full w-1 rounded-full block mr-2.5",
                        {
                          "bg-secondary": env.key === environment(),
                          "bg-middle": env.key !== environment(),
                        }
                      )}
                    ></span>
                    {env.title}
                  </button>
                </li>
              )}
            </For>
          </ul>
          <Separator.Root class="border-middle my-2.5 w-full" />
          <Link
            href="/env/create"
            class="text-sm border flex w-full bg-primary border-middle px-2.5 py-2 rounded-md text-primaryText hover:bg-primaryText hover:text-primary hover:border-primary"
          >
            Create Environment
          </Link>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default EnvironmentSelector;
