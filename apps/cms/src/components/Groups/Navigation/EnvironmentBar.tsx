import {
  Component,
  createEffect,
  createSignal,
  Show,
  For,
  createMemo,
} from "solid-js";
import { useLocation } from "@solidjs/router";
// State
import { environment } from "@/state/environment";
// Types
import { CollectionResT } from "@lucid/types/src/collections";
// Components
import NavigationLink from "@/components/Groups/Navigation/NavigationLink";
import NavigationLinkGroup from "@/components/Groups/Navigation/NavigationLinkGroup";

interface EnvironmentBarProps {
  collections: CollectionResT[];
}

const EnvironmentBar: Component<EnvironmentBarProps> = (props) => {
  // ----------------------------------
  // Hooks & States
  const location = useLocation();
  const [showBar, setShowBar] = createSignal(false);

  // ----------------------------------
  // Effects
  createEffect(() => {
    if (location.pathname.includes("/env/")) {
      setShowBar(true);
    } else {
      setShowBar(false);
    }
  });

  // ----------------------------------
  // Memos
  const pagesCollections = createMemo(() => {
    return props.collections.filter(
      (collection) => collection.type === "pages"
    );
  });
  const singlePagesCollections = createMemo(() => {
    return props.collections.filter(
      (collection) => collection.type === "singlepage"
    );
  });

  // ----------------------------------
  // Render
  return (
    <Show when={showBar()}>
      <nav class="w-[240px] bg-white border-r border-border h-full">
        <div class="h-16 w-full bg-white border-b border-border mb-4">
          {environment()}
        </div>

        {/* Multi Collections */}
        <NavigationLinkGroup title="Multi Collections">
          <For each={pagesCollections()}>
            {(collection) => (
              <NavigationLink
                title={collection.title}
                href={`/env/${environment()}/collection/${collection.key}`}
                icon="page"
              />
            )}
          </For>
        </NavigationLinkGroup>
        {/* Single Collections */}
        <NavigationLinkGroup title="Single Collections">
          <For each={singlePagesCollections()}>
            {(collection) => (
              <NavigationLink
                title={collection.title}
                href={`/env/${environment()}/collection/${collection.key}`}
                icon="page"
              />
            )}
          </For>
        </NavigationLinkGroup>
      </nav>
    </Show>
  );
};

export default EnvironmentBar;
