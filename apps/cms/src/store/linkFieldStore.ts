import { createStore } from "solid-js/store";
// Types
import type {
  PageLinkValueT,
  LinkValueT,
  PageLinkMetaT,
} from "@headless/types/src/bricks";

type SelectCallbackT = (
  _link: PageLinkValueT | LinkValueT | null,
  _meta?: PageLinkMetaT | null
) => void;

type LinkFieldStoreT = {
  open: boolean;
  type: "pagelink" | "link";
  onSelectCallback: SelectCallbackT;
  selectedPageLink: PageLinkValueT | null;
  selectedLink: LinkValueT | null;
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
