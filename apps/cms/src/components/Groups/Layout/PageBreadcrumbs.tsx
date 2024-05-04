import { type Component, onMount, Show, For } from "solid-js";
import { FaSolidCaretRight } from "solid-icons/fa";
import { A } from "@solidjs/router";
import classNames from "classnames";

export interface PageBreadcrumbsProps {
	breadcrumbs?: {
		link: string;
		label: string;
		include?: boolean;
	}[];
	options?: {
		noBorder?: boolean;
	};
}

export const PageBreadcrumbs: Component<PageBreadcrumbsProps> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<Show when={props.breadcrumbs}>
			<nav
				class={classNames("px-15 md:px-30 py-15 bg-container-1", {
					"border-b border-border": props.options?.noBorder !== true,
				})}
			>
				<ul class="flex items-center">
					<For each={props.breadcrumbs}>
						{(breadcrumb, i) => (
							<Show when={breadcrumb.include !== false}>
								<li class="flex items-center">
									<A
										href={breadcrumb.link}
										class="flex items-center text-title hover:text-primaryDark text-sm"
									>
										{breadcrumb.label}
									</A>
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
