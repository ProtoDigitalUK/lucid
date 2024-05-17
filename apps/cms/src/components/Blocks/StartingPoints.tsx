import { For, type Component } from "solid-js";
import { A } from "@solidjs/router";

interface StartingPointsProps {
	links: Array<{
		title: string;
		description: string;
		href: string;
	}>;
}

const StartingPoints: Component<StartingPointsProps> = (props) => {
	// -------------------------------
	// Render
	return (
		<ul class="grid grid-cols-1 gap-15 border-b border-border md:grid-cols-3 mb-15 pb-15 last:mb-0 last:pb-0">
			<For each={props.links}>
				{(link) => (
					<li class="relative bg-container-2 border border-border p-15 rounded-md h-full flex space-x-4 focus-within:ring-1 focus-within:ring-primary-base">
						<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-pink-500">
							<svg
								class="h-6 w-6 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
								/>
							</svg>
						</div>
						<div>
							<h3 class="text-sm font-medium text-title">
								<A href={link.href} class="focus:outline-none">
									<span
										class="absolute inset-0"
										aria-hidden="true"
									/>
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
