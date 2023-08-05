import {
  Component,
  JSXElement,
  Show,
  createSignal,
  Index,
  Switch,
  Match,
  createMemo,
  createEffect,
} from "solid-js";
// Components
import Table from "@/components/Groups/Table";
import Query from "@/components/Groups/Query";
import SelectColumn from "@/components/Tables/Columns/SelectColumn";

interface TableRootProps {
  key: string;
  rows: number;
  meta?: APIResponse<any>["meta"];
  caption?: string;

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
  const [include, setInclude] = createSignal<boolean[]>([]);
  const [selected, setSelected] = createSignal(
    Array.from({ length: props.rows }, () => false)
  );

  // ----------------------------------------
  // Functions
  const toggleInclude = (index: number) => {
    const isOnlyOne = include().filter((i) => i).length === 1;
    if (isOnlyOne && include()[index]) {
      return;
    }

    setInclude((prev) => {
      const newInclude = [...prev];
      newInclude[index] = !newInclude[index];
      return newInclude;
    });

    setIncludeLS(include());
  };
  const setSelectedIndex = (index: number) => {
    setSelected((prev) => {
      const newSelected = [...prev];
      newSelected[index] = !newSelected[index];
      return newSelected;
    });
  };

  // ----------------------------------------
  // Local Storage
  const getIncludeLS = () => {
    const include = localStorage.getItem(`${props.key}-include`);
    if (include) {
      return JSON.parse(include);
    } else {
      return props.head.map(() => true);
    }
  };
  const setIncludeLS = (include: boolean[]) => {
    localStorage.setItem(`${props.key}-include`, JSON.stringify(include));
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
  const includeRows = createMemo(() => {
    return props.head.map((h, i) => {
      return {
        index: i,
        label: h.label,
        include: include()[i],
      };
    });
  });

  // ----------------------------------------
  // Effects
  createEffect(() => {
    setInclude(getIncludeLS());
  });

  // ----------------------------------------
  // Render
  return (
    <>
      {/* Table */}
      <div class="w-full overflow-x-auto">
        <table class="w-full table h-auto">
          <Show when={props?.caption}>
            <caption class="caption-bottom bg-primary text-primaryText py-2 text-sm">
              {props?.caption}
            </caption>
          </Show>
          <thead class="border-y border-border">
            <tr class="h-10">
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
                    key={head().key}
                    index={index}
                    label={head().label}
                    icon={head().icon}
                    options={{
                      include: include()[index],
                      sortable: head().sortable,
                    }}
                  />
                )}
              </Index>
              <Table.Th classes={"text-right right-0 hover:bg-background"}>
                <Table.ColumnToggle
                  columns={includeRows() || []}
                  callbacks={{
                    toggle: toggleInclude,
                  }}
                />
              </Table.Th>
            </tr>
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
      <Show when={props.meta}>
        <Query.Pagination
          data={{
            meta: props.meta as APIResponse<any>["meta"],
          }}
        />
      </Show>
    </>
  );
};
