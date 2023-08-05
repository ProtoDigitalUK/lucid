import {
  Component,
  JSXElement,
  Show,
  createSignal,
  Index,
  Switch,
  Match,
  createMemo,
} from "solid-js";
// Components
import Table from "@/components/Groups/Table";
import Query from "@/components/Groups/Query";
import SelectColumn from "@/components/Tables/Columns/SelectColumn";

interface TableRootProps {
  head: {
    label: string;
    key: string;
    icon?: JSXElement;
    sortable?: boolean;
  }[];
  state: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  };
  data: {
    rows: number;
    meta?: APIResponse<any>["meta"];
  };
  content?: {
    caption?: string;
  };
  options?: {
    isSelectable?: boolean;
  };
  callbacks?: {
    deleteRows?: () => void;
  };
  children: (props: {
    include: boolean[];
    isSelectable: boolean;
    selected: boolean[];
    setSelected: (i: number) => void;
  }) => JSXElement;
}

export const TableRoot: Component<TableRootProps> = (props) => {
  const [include, setInclude] = createSignal(props.head.map(() => true));
  const [selected, setSelected] = createSignal(
    Array.from({ length: props.data.rows }, () => false)
  );

  // ----------------------------------------
  // Functions
  const toggleInclude = (index: number) => {
    setInclude((prev) => {
      const newInclude = [...prev];
      newInclude[index] = !newInclude[index];
      return newInclude;
    });
  };
  const setSelectedIndex = (index: number) => {
    setSelected((prev) => {
      const newSelected = [...prev];
      newSelected[index] = !newSelected[index];
      return newSelected;
    });
  };

  // ----------------------------------------
  // Callbacks
  const onSelectChange = () => {
    if (allSelected()) {
      setSelected((prev) => {
        return prev.map(() => false);
      });
    } else {
      setSelected((prev) => {
        return prev.map(() => true);
      });
    }
  };

  // ----------------------------------------
  // Memos
  const isSelectable = createMemo(() => {
    return props.options?.isSelectable ?? false;
  });
  const allSelected = createMemo(() => {
    return selected().every((s) => s);
  });
  const selectedCount = createMemo(() => {
    return selected().filter((s) => s).length;
  });

  // ----------------------------------------
  // Render
  return (
    <>
      {/* Table */}
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
          <Show when={props.content?.caption}>
            <caption class="caption-bottom">{props.content?.caption}</caption>
          </Show>
          <thead class="">
            <Table.Tr>
              <Show when={isSelectable()}>
                <SelectColumn
                  type="th"
                  value={allSelected()}
                  onChange={onSelectChange}
                />
              </Show>
              <Index each={props.head}>
                {(head, index) => (
                  <Table.Th
                    options={{
                      include: include()[index],
                      sortable: head().sortable,
                    }}
                    data={{
                      key: head().key,
                      index: index,
                    }}
                    content={{
                      label: head().label,
                      icon: head().icon,
                    }}
                  />
                )}
              </Index>
            </Table.Tr>
          </thead>
          <tbody>
            {props.children({
              include: include(),
              isSelectable: isSelectable(),
              selected: selected(),
              setSelected: setSelectedIndex,
            })}
          </tbody>
        </table>
      </div>
      {/* Select Action */}
      <Show
        when={selectedCount() > 0 && props.callbacks?.deleteRows !== undefined}
      >
        <Table.SelectAction
          data={{
            selected: selectedCount(),
          }}
          callbacks={{
            reset: () => setSelected((prev) => prev.map(() => false)),
            delete: () => props.callbacks?.deleteRows?.(),
          }}
        />
      </Show>
      {/* Pagination */}
      <Show when={props.data.meta}>
        <Query.Pagination
          data={{
            meta: props.data.meta as APIResponse<any>["meta"],
          }}
        />
      </Show>
    </>
  );
};
