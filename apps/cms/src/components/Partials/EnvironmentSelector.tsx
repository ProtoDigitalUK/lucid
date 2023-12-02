import T from "@/translations";
import { Component, createMemo, createSignal, For, Show } from "solid-js";
import classNames from "classnames";
import { useNavigate, useParams } from "@solidjs/router";
// Store
import { environment, setEnvironment } from "@/store/environmentStore";
import userStore from "@/store/userStore";
// Utils
import helpers from "@/utils/helpers";
// Types
import type { EnvironmentResT } from "@headless/types/src/environments";
// Components
import { FaSolidPlus, FaSolidGear } from "solid-icons/fa";
import { DropdownMenu, Separator } from "@kobalte/core";
import { FaSolidChevronRight } from "solid-icons/fa";
import Link from "@/components/Partials/Link";
import DropdownContent from "@/components/Partials/DropdownContent";

interface EnvironmentSelectorProps {
  environments: EnvironmentResT[];
}

const EnvironmentSelector: Component<EnvironmentSelectorProps> = (props) => {
  // ----------------------------------
  // Hooks & States
  const [open, setOpen] = createSignal(false);

  const navigate = useNavigate();
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
      const url = helpers.getFirstEnvLink({
        collections: [],
        canCreate: userStore.get.hasPermission(["create_environment"]).all,
        environment: envKey,
      });
      navigate(url, { replace: true });
    } else {
      setEnvironment(envKey);
    }
  };

  // ----------------------------------
  // Render
  return (
    <DropdownMenu.Root open={open()} onOpenChange={setOpen}>
      <DropdownMenu.Trigger class="dropdown-trigger relative h-[60px] w-full bg-container border-b border-border mb-15 flex items-center justify-between px-15">
        <span class="text-title font-medium">{environmentData()?.title}</span>

        <FaSolidChevronRight
          class={classNames("fill-title transition-all duration-200", {
            "transform rotate-90": open(),
          })}
        />
      </DropdownMenu.Trigger>

      <DropdownContent
        options={{
          class: "w-[240px]",
        }}
      >
        <ul>
          <For each={props.environments}>
            {(env) => (
              <li class="mb-1.5 last:mb-0">
                <button
                  type="button"
                  class={
                    "text-base text-primaryText w-full text-left flex py-0.5 group justify-between items-center relative"
                  }
                  onClick={() => {
                    changeEnvironment(env.key);
                    setOpen(false);
                  }}
                >
                  <div class="flex items-center">
                    <span
                      class={classNames(
                        "absolute left-0 top-0 bottom-0 w-1 rounded-full block group-hover:bg-secondaryH duration-200 transition-colors",
                        {
                          "bg-secondary": env.key === environment(),
                          "bg-primaryA": env.key !== environment(),
                        }
                      )}
                    />
                    <span class="ml-2.5">{env.title}</span>
                  </div>
                  <Show
                    when={
                      userStore.get.hasPermission([
                        "update_environment",
                        "delete_environment",
                      ]).some
                    }
                  >
                    <Link
                      size="auto"
                      theme="basic"
                      href={`/env/${env.key}`}
                      classes="hover:fill-secondaryH fill-primaryText ml-2"
                    >
                      <FaSolidGear
                        class="duration-200 transition-colors"
                        size={14}
                      />
                    </Link>
                  </Show>
                </button>
              </li>
            )}
          </For>
        </ul>
        <Show when={userStore.get.hasPermission(["create_environment"]).all}>
          <Separator.Root class="border-primaryA my-2.5 w-full" />
          <Link
            href="/env/create"
            theme="primary-outline"
            size="x-small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <FaSolidPlus class="mr-2" />
            {T("create_environment")}
          </Link>
        </Show>
      </DropdownContent>
    </DropdownMenu.Root>
  );
};

export default EnvironmentSelector;
