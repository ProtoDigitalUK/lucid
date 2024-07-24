import { createMemo, Show, type Component } from "solid-js";
import { useLocation } from "@solidjs/router";

export const CollectionSubMenu: Component = (props) => {
	// ----------------------------------------
	// State
	const location = useLocation();

	// ----------------------------------------
	// Memos
	const targetSubMenu = createMemo(() => {
		if (location.pathname.includes("/admin/collections")) return true;
	});
	// ----------------------------------------
	// Render
	return (
		<Show when={targetSubMenu()}>
			<div class="w-60 h-full border-r border-border overflow-y-auto">
				<span>hi collections</span>
			</div>
		</Show>
	);
};
