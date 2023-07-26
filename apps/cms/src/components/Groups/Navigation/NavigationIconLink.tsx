import { Component, Switch, Match } from "solid-js";
import classNames from "classnames";
import {
  FaSolidPhotoFilm,
  FaSolidUsers,
  FaSolidGear,
  FaSolidEarthEurope,
  FaSolidHouse,
} from "solid-icons/fa";
// Components
import { Link } from "@solidjs/router";
import { Tooltip } from "@kobalte/core";
import TooltipContent from "@/components/Partials/TooltipContent";

interface NavigationIconLinkProps {
  title: string;
  href: string;
  icon: "dashboard" | "environment" | "media" | "users" | "settings";
  active?: boolean;
}

const NavigationIconLink: Component<NavigationIconLinkProps> = (props) => {
  // ----------------------------------
  // Hooks & States

  // ----------------------------------
  // Classes
  const iconClasses = classNames("w-5 h-5 text-white");

  // ----------------------------------
  // Render
  return (
    <li class="mb-2.5 last:mb-0">
      <Tooltip.Root placement={"left"}>
        <Tooltip.Trigger>
          <Link
            href={props.href}
            class={classNames(
              "w-10 h-10 focus:outline-none focus:!border-primary focus:ring-0 flex items-center justify-center bg-white rounded-lg border border-transparent transition-colors duration-200 ease-in-out hover:border-primary",
              {
                "!border-primary": props.active,
              }
            )}
            activeClass={!props.active ? "!border-primary" : ""}
            end
          >
            <Switch>
              <Match when={props.icon === "dashboard"}>
                <FaSolidHouse class={iconClasses} />
              </Match>
              <Match when={props.icon === "environment"}>
                <FaSolidEarthEurope class={iconClasses} />
              </Match>
              <Match when={props.icon === "media"}>
                <FaSolidPhotoFilm class={iconClasses} />
              </Match>
              <Match when={props.icon === "users"}>
                <FaSolidUsers class={iconClasses} />
              </Match>
              <Match when={props.icon === "settings"}>
                <FaSolidGear class={iconClasses} />
              </Match>
            </Switch>
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <TooltipContent text={props.title} />
        </Tooltip.Portal>
      </Tooltip.Root>
    </li>
  );
};

export default NavigationIconLink;
