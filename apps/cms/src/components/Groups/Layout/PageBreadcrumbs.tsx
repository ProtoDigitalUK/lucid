import { type Component, onMount, Show, For } from "solid-js";
import { FaSolidCaretRight } from "solid-icons/fa";
import { Link } from "@solidjs/router";
import classNames from "classnames";

export interface PageBreadcrumbsProps {
	breadcrumbs?: {
		link: string;
		label: string;
		include?: boolean;
	}[];
	options?: {
		noBorder?: boolean;
		background?: "white";
	};
}

export const PageBreadcrumbs: Component<PageBreadcrumbsProps> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<Show when={props.breadcrumbs}>
			<nav
				class={classNames("px-15 md:px-30 py-15", {
					"border-b border-border": props.options?.noBorder !== true,
					"bg-white": props.options?.background === "white",
				})}
			>
				<ul class="flex items-center">
					<For each={props.breadcrumbs}>
						{(breadcrumb, i) => (
							<Show when={breadcrumb.include !== false}>
								<li class="flex items-center">
									<Link
										href={breadcrumb.link}
										class="flex items-center text-primary hover:text-primaryDark text-sm"
									>
										{breadcrumb.label}
									</Link>
									<Show
										when={
											props.breadcrumbs &&
											i() < props.breadcrumbs.length - 1
										}
									>
										<FaSolidCaretRight class="mx-2.5 text-sm" />
									</Show>
								</li>
							</Show>
						)}
					</For>
				</ul>
			</nav>
		</Show>
	);
};
