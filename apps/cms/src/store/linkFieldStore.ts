import { createStore } from "solid-js/store";
// Types
import type { PageLinkValueT, PageLinkMetaT } from "@headless/types/src/bricks"; // TODO: remove
import type { LinkValue } from "@protoheadless/core/types";

type SelectCallbackT = (
	_link: PageLinkValueT | LinkValue | null,
	_meta?: PageLinkMetaT | null,
) => void;

type LinkFieldStoreT = {
	open: boolean;
	type: "pagelink" | "link";
	onSelectCallback: SelectCallbackT;
	selectedPageLink: PageLinkValueT | null;
	selectedLink: LinkValue | null;
	selectedMeta: PageLinkMetaT | null;
};

const [get, set] = createStore<LinkFieldStoreT>({
	open: false,
	type: "link",
	onSelectCallback: () => {},
	selectedPageLink: null,
	selectedLink: null,
	selectedMeta: null,
});

const linkFieldStore = {
	get,
	set,
};

export default linkFieldStore;
