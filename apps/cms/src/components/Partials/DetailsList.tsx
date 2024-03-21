import { type Component, For, Match, Show, Switch } from "solid-js";
// Components
import Pill from "@/components/Partials/Pill";
import classNames from "classnames";

interface DetailsListProps {
	type: "text" | "pill";
	items: Array<{
		label: string;
		value?: string | number;
		show?: boolean;
	}>;
}

const DetailsList: Component<DetailsListProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<ul class="w-full mb-30 last:mb-0">
			<For each={props.items}>
				{(item) => (
					<Show when={item.show !== false}>
						<li
							class={classNames("flex mb-2 last:mb-0", {
								"flex-col items-start lg:flex-row lg:items-center lg:justify-between border-b border-border pb-2 last:border-b-0":
									props.type === "text",
								"justify-between items-center":
									props.type === "pill",
							})}
						>
							<Switch>
								<Match when={props.type === "pill"}>
									<span class="font-medium text-unfocused">
										{item.label}
									</span>
									<Show when={item.value !== undefined}>
										<Pill theme="primary">
											{item.value}
										</Pill>
									</Show>
								</Match>
								<Match when={props.type === "text"}>
									<span class="font-medium text-title text-sm">
										{item.label}
									</span>
									<Show when={item.value !== undefined}>
										<span class="font-medium text-unfocused text-sm">
											{item.value}
										</span>
									</Show>
								</Match>
							</Switch>
						</li>
					</Show>
				)}
			</For>
		</ul>
	);
};

export default DetailsList;
