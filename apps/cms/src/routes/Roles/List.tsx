import T from "@/translations";
import { Component, createSignal } from "solid-js";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import RolesTable from "@/components/Tables/RolesTable";
import UpsertRolePanel from "@/components/Panels/Role/UpsertRolePanel";

const RolesListRoute: Component = () => {
  // ----------------------------------
  // Hooks & State
  const searchParams = useSearchParams(
    {
      filters: {
        name: {
          value: "",
          type: "text",
        },
      },
      sorts: {
        name: undefined,
        created_at: undefined,
      },
    },
    {
      singleSort: true,
    }
  );
  const [openCreateRolePanel, setOpenCreateRolePanel] = createSignal(false);

  // ----------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={T("roles_route_title")}
      description={T("roles_route_description")}
      options={{
        noPadding: true,
      }}
      actions={{
        create: {
          open: openCreateRolePanel(),
          setOpen: setOpenCreateRolePanel,
        },
      }}
      headingChildren={
        <Query.Row
          searchParams={searchParams}
          filters={[
            {
              label: T("name"),
              key: "name",
              type: "text",
            },
          ]}
          sorts={[
            {
              label: T("name"),
              key: "name",
            },
            {
              label: T("created_at"),
              key: "created_at",
            },
          ]}
          perPage={[]}
        />
      }
    >
      <RolesTable searchParams={searchParams} />
      <UpsertRolePanel
        state={{
          open: openCreateRolePanel(),
          setOpen: setOpenCreateRolePanel,
        }}
      />
    </Layout.PageLayout>
  );
};

export default RolesListRoute;
