import T from "@/translations";
import {
  Component,
  createEffect,
  createSignal,
  Show,
  For,
  createMemo,
} from "solid-js";
import { useLocation } from "@solidjs/router";
// Store
import { environment } from "@/store/environmentStore";
// Types
import { CollectionResT } from "@lucid/types/src/collections";
import { EnvironmentResT } from "@lucid/types/src/environments";
// Components
import EnvironmentSelector from "@/components/Partials/EnvironmentSelector";
import Navigation from "@/components/Groups/Navigation";

interface EnvironmentBarProps {
  collections: CollectionResT[];
  environments: EnvironmentResT[];
}

export const EnvironmentBar: Component<EnvironmentBarProps> = (props) => {
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
      <div class="w-[240px] bg-container border-r border-border h-full">
        <EnvironmentSelector environments={props.environments} />
        <nav>
          {/* Multi Collections */}
          <Show when={pagesCollections().length > 0}>
            <Navigation.LinkGroup title={T("multi_collections")}>
              <For each={pagesCollections()}>
                {(collection) => (
                  <Navigation.Link
                    title={collection.title}
                    href={`/env/${environment()}/collection/${collection.key}`}
                    icon="page"
                  />
                )}
              </For>
            </Navigation.LinkGroup>
          </Show>
          {/* Single Collections */}
          <Show when={singlePagesCollections().length > 0}>
            <Navigation.LinkGroup title={T("single_collections")}>
              <For each={singlePagesCollections()}>
                {(collection) => (
                  <Navigation.Link
                    title={collection.title}
                    href={`/env/${environment()}/collection/${collection.key}`}
                    icon="page"
                  />
                )}
              </For>
            </Navigation.LinkGroup>
          </Show>
        </nav>
      </div>
    </Show>
  );
};
