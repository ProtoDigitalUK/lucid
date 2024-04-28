import { type Component, Switch, createMemo, Match } from "solid-js";
import linkFieldStore from "@/store/linkFieldStore";
import Modal from "@/components/Groups/Modal";
import PageLinkContent from "./PageLinkContent";
import LinkContent from "./LinkContent";

const LinkSelect: Component = () => {
	// ------------------------------
	// Memos
	const open = createMemo(() => linkFieldStore.get.open);

	// ------------------------------
	// Render
	return (
		<Modal.Root
			state={{
				open: open(),
				setOpen: () => linkFieldStore.set("open", false),
			}}
			options={{
				noPadding: true,
			}}
		>
			<Switch>
				<Match when={linkFieldStore.get.type === "pagelink"}>
					<PageLinkContent />
				</Match>
				<Match when={linkFieldStore.get.type === "link"}>
					<LinkContent />
				</Match>
			</Switch>
		</Modal.Root>
	);
};

export default LinkSelect;
