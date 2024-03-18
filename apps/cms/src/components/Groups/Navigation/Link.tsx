import { Component, Switch, Match } from "solid-js";
import classNames from "classnames";
import { FaSolidFile } from "solid-icons/fa";
// Components
import { Link } from "@solidjs/router";

interface NavigationLinkProps {
	title: string;
	href: string;
	icon: "page";
}

export const NavigationLink: Component<NavigationLinkProps> = (props) => {
	// ----------------------------------
	// Hooks & States

	// ----------------------------------
	// Classes
	const iconClasses = classNames("w-5 h-5 text-white");

	// ----------------------------------
	// Render
	return (
		<li class="mb-1 last:mb-0">
			<Link
				title={props.title}
				href={props.href}
				class={classNames(
					"h-10 w-full flex bg-container text-body fill-body hover:text-body hover:bg-backgroundAccent transition-colors duration-200 ease-in-out items-center px-2.5 rounded-md",
				)}
				activeClass={classNames(
					"!bg-backgroundAccent !text-title !fill-title",
				)}
				end
			>
				<Switch>
					<Match when={props.icon === "page"}>
						<FaSolidFile class={iconClasses} />
					</Match>
				</Switch>
				<span class="ml-2.5 block text-sm font-medium">
					{props.title}
				</span>
			</Link>
		</li>
	);
};
