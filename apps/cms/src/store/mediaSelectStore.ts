import { createStore } from "solid-js/store";
// Types
import type { MediaResT } from "@headless/types/src/media";

type SelectCallbackT = (_media: MediaResT) => void;

type MediaSelectStoreT = {
	open: boolean;
	onSelectCallback: SelectCallbackT;

	extensions?: string;
	type?: string;
	selected?: MediaResT["id"];
};

const [get, set] = createStore<MediaSelectStoreT>({
	open: false,
	onSelectCallback: () => {},
});

const mediaSelectStore = {
	get,
	set,
};

export default mediaSelectStore;
