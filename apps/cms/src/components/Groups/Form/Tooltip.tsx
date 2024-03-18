import { Component, Show } from "solid-js";
import classnames from "classnames";
import { FaSolidInfo } from "solid-icons/fa";
// Components
import { HoverCard } from "@kobalte/core";

interface TooltipProps {
	copy?: string;
	theme?: "basic";
}

export const Tooltip: Component<TooltipProps> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<Show when={props.copy}>
			<HoverCard.Root>
				<HoverCard.Trigger
					class={classnames(
						"h-4 w-4 cursor-help hover:bg-secondary absolute bg-primary rounded-full fill-primaryText flex items-center justify-center duration-200 transition-colors",
						{
							"top-1/2 -translate-y-1/2 right-2.5":
								props.theme !== "basic",
							"top-0 right-0": props.theme === "basic",
						},
					)}
				>
					<FaSolidInfo size={10} />
				</HoverCard.Trigger>
				<HoverCard.Portal>
					<HoverCard.Content class="z-50 bg-primary w-80 mt-2.5 rounded-md p-15 border border-primaryA2 shadow-sm">
						<p class="text-sm text-primaryText">{props.copy}</p>
					</HoverCard.Content>
				</HoverCard.Portal>
			</HoverCard.Root>
		</Show>
	);
};
