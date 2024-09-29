import { type Component, Switch, Match, For } from "solid-js";
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
import { A } from "@solidjs/router";

interface StartingPointsProps {
	links: Array<{
		title: string;
		description: string;
		href: string;
		icon: "collection" | "media" | "users" | "settings" | "roles" | "email";
	}>;
}

const StartingPoints: Component<StartingPointsProps> = (props) => {
	// ----------------------------------
	// Classes
	const iconClasses = classNames("w-4 h-4 text-primary-contrast");

	// -------------------------------
	// Render
	return (
		<ul class="grid grid-cols-1 gap-15 md:grid-cols-3 mb-15 pb-15 last:mb-0 last:pb-0">
			<For each={props.links}>
				{(link) => (
					<li class="relative bg-container-2 border border-border p-15 rounded-md h-full flex space-x-2.5 focus-within:ring-1 focus-within:ring-primary-base">
						<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary-base">
							<Switch>
								<Match when={link.icon === "collection"}>
									<FaSolidBox class={iconClasses} />
								</Match>
								<Match when={link.icon === "media"}>
									<FaSolidPhotoFilm class={iconClasses} />
								</Match>
								<Match when={link.icon === "users"}>
									<FaSolidUsers class={iconClasses} />
								</Match>
								<Match when={link.icon === "settings"}>
									<FaSolidGear class={iconClasses} />
								</Match>
								<Match when={link.icon === "roles"}>
									<FaSolidUserLock class={iconClasses} />
								</Match>
								<Match when={link.icon === "email"}>
									<FaSolidEnvelope class={iconClasses} />
								</Match>
							</Switch>
						</div>
						<div>
							<h3 class="text-sm font-medium text-title">
								<A href={link.href} class="focus:outline-none">
									<span class="absolute inset-0" aria-hidden="true" />
									<span>{link.title}</span>
									<span aria-hidden="true"> &rarr;</span>
								</A>
							</h3>
							<p class="mt-1 text-sm text-unfocused line-clamp-2">
								{link.description}
							</p>
						</div>
					</li>
				)}
			</For>
		</ul>
	);
};

export default StartingPoints;
