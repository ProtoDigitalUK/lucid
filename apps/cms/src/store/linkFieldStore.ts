import { createStore } from "solid-js/store";
import type { LinkValue } from "@lucidcms/core/types";

type SelectCallbackT = (_link: LinkValue | null) => void;

type LinkFieldStoreT = {
	open: boolean;
	onSelectCallback: SelectCallbackT;
	selectedLink: LinkValue | null;
};

const [get, set] = createStore<LinkFieldStoreT>({
	open: false,
	onSelectCallback: () => {},
	selectedLink: null,
});

const linkFieldStore = {
	get,
	set,
};

export default linkFieldStore;
