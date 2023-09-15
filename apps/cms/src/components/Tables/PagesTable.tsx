import T from "@/translations";
import { Component, Index } from "solid-js";
import { FaSolidT, FaSolidCalendar } from "solid-icons/fa";
// Types
import { CollectionResT } from "@lucid/types/src/collections";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
import useSearchParams from "@/hooks/useSearchParams";
// Components
import Table from "@/components/Groups/Table";
import PageRow from "@/components/Tables/Rows/PageRow";

interface PagesTableProps {
  collection: CollectionResT;
  searchParams: ReturnType<typeof useSearchParams>;
}

const PagesTable: Component<PagesTableProps> = (props) => {
  // ----------------------------------
  // Hooks
  const rowTarget = useRowTarget({
    triggers: {
      delete: false,
    },
  });

  // ----------------------------------
  // Queries
  const pages = api.environment.collections.pages.useGetMultiple({
    queryParams: {
      queryString: props.searchParams.getQueryString,
    },
    enabled: () => props.searchParams.getSettled(),
  });

  // ----------------------------------
  // Render
  return (
    <>
      <Table.Root
        key={"collections.pages.list"}
        rows={pages.data?.data.length || 0}
        meta={pages.data?.meta}
        searchParams={props.searchParams}
        head={[
          {
            label: T("title"),
            key: "title",
            icon: <FaSolidT />,
          },
          {
            label: T("created_at"),
            key: "created_at",
            icon: <FaSolidCalendar />,
            sortable: true,
          },
          {
            label: T("updated_at"),
            key: "updated_at",
            icon: <FaSolidCalendar />,
          },
        ]}
        state={{
          isLoading: pages.isLoading,
          isError: pages.isError,
          isSuccess: pages.isSuccess,
        }}
        options={{
          isSelectable: false,
        }}
      >
        {({ include, isSelectable, selected, setSelected }) => (
          <Index each={pages.data?.data || []}>
            {(page, i) => (
              <PageRow
                index={i}
                page={page()}
                collection={props.collection}
                environmentKey={environment() as string}
                include={include}
                selected={selected[i]}
                rowTarget={rowTarget}
                options={{
                  isSelectable,
                }}
                callbacks={{
                  setSelected: setSelected,
                }}
              />
            )}
          </Index>
        )}
      </Table.Root>
    </>
  );
};

export default PagesTable;
