import {
  Component,
  JSXElement,
  Show,
  createSignal,
  Index,
  Switch,
  Match,
} from "solid-js";
// Components
import Table from "@/components/Groups/Table";

interface TableRootProps {
  head: {
    label: string;
    key: string;
    icon?: JSXElement;
    sortable?: boolean;
  }[];

  caption?: string;
  children: (include: boolean[]) => JSXElement;
}

export const TableRoot: Component<TableRootProps> = (props) => {
  const [include, setInclude] = createSignal(props.head.map(() => true));

  // ----------------------------------------
  // Functions
  const toggleInclude = (index: number) => {
    setInclude((prev) => {
      const newInclude = [...prev];
      newInclude[index] = !newInclude[index];
      return newInclude;
    });
  };

  // ----------------------------------------
  // Render
  return (
    <div class="w-full overflow-x-auto">
      <div class="mb-10 border-b">
        <Index each={include()}>
          {(include, index) => (
            <button
              class="px-2 py-1 mr-2 text-sm text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
              onClick={() => toggleInclude(index)}
            >
              <Switch>
                <Match when={include()}>
                  <span class="mr-1">Hide</span>
                </Match>
                <Match when={!include()}>
                  <span class="mr-1">Show</span>
                </Match>
              </Switch>
            </button>
          )}
        </Index>
      </div>

      <table class="w-full table-fixed h-auto">
        <Show when={props.caption}>
          <caption class="caption-bottom">{props.caption}</caption>
        </Show>
        <thead class="">
          <tr>
            <Index each={props.head}>
              {(head, index) => (
                <Table.Th
                  index={index}
                  label={head().label}
                  key={head().key}
                  icon={head().icon}
                  sortable={head().sortable}
                  include={include()[index]}
                />
              )}
            </Index>
          </tr>
        </thead>
        <tbody>{props.children(include())}</tbody>
      </table>
    </div>
  );
};
