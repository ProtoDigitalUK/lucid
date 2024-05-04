import { type Component, Switch, Match, Show } from "solid-js";
import classNames from "classnames";
import {
	FaSolidPhotoFilm,
	FaSolidUsers,
	FaSolidGear,
	FaSolidHouse,
	FaSolidUserLock,
	FaSolidEnvelope,
	FaSolidBox,
} from "solid-icons/fa";
// Components
import { A } from "@solidjs/router";
import { Tooltip } from "@kobalte/core";
import TooltipContent from "@/components/Partials/TooltipContent";

interface IconLinkProps {
	title: string;
	href: string;
	icon:
		| "dashboard"
		| "collection"
		| "media"
		| "users"
		| "settings"
		| "roles"
		| "email";
	active?: boolean;
	permission?: boolean;
}

export const IconLink: Component<IconLinkProps> = (props) => {
	// ----------------------------------
	// Classes
	const iconClasses = classNames("w-5 h-5 text-primary");

	// ----------------------------------
	// Render
	return (
		<Show when={props.permission !== false}>
			<li class="mb-2.5 last:mb-0">
				<Tooltip.Root placement={"left"}>
					<Tooltip.Trigger tabIndex={-1}>
						<A
							href={props.href}
							class={classNames(
								"w-10 h-10 focus:outline-none focus:!border-secondary focus:ring-0 flex items-center justify-center bg-container rounded-lg border border-transparent transition-colors duration-200 ease-in-out hover:border-primary",
								{
									"!border-primary": props.active,
								},
							)}
							activeClass={!props.active ? "!border-primary" : ""}
							end={props.href === "/"}
						>
							<Switch>
								<Match when={props.icon === "dashboard"}>
									<FaSolidHouse class={iconClasses} />
								</Match>
								<Match when={props.icon === "collection"}>
									<FaSolidBox class={iconClasses} />
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
								<Match when={props.icon === "roles"}>
									<FaSolidUserLock class={iconClasses} />
								</Match>
								<Match when={props.icon === "email"}>
									<FaSolidEnvelope class={iconClasses} />
								</Match>
							</Switch>
						</A>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<TooltipContent text={props.title} />
					</Tooltip.Portal>
				</Tooltip.Root>
			</li>
		</Show>
	);
};
