import { type Component, Show } from "solid-js";

export const Standard: Component<{
	copy?: {
		title?: string;
		description?: string;
	};
}> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<div class="bg-container-2 border-b border-border">
			<div class="p-15 md:p-30">
				<Show when={props.copy?.title}>
					<h1>{props.copy?.title}</h1>
				</Show>
				<Show when={props.copy?.description}>
					<p class="mt-1">{props.copy?.description}</p>
				</Show>
			</div>
		</div>
	);
};
