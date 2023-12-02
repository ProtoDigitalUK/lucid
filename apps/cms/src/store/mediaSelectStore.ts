import { createStore } from "solid-js/store";
// Types
import { MediaResT } from "@headless/types/src/media";

type SelectCallbackT = (_media: MediaResT) => void;

type MediaSelectStoreT = {
  open: boolean;
  onSelectCallback: SelectCallbackT;
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
