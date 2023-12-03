import { createStore } from "solid-js/store";
// Types
import type { PageLinkValueT, LinkValueT } from "@headless/types/src/bricks";

type SelectCallbackT = (_link: PageLinkValueT | LinkValueT) => void;

type LinkFieldStoreT = {
  open: boolean;
  type: "pagelink" | "link";
  onSelectCallback: SelectCallbackT;
};

const [get, set] = createStore<LinkFieldStoreT>({
  open: false,
  type: "link",
  onSelectCallback: () => {},
});

const linkFieldStore = {
  get,
  set,
};

export default linkFieldStore;
