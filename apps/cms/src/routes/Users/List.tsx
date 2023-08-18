import T from "@/translations";
import { Component } from "solid-js";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import UsersTable from "@/components/Tables/UsersTable";

const UsersListRoute: Component = () => {
  // ----------------------------------
  // Hooks & State
  const searchParams = useSearchParams(
    {
      filters: {
        first_name: {
          value: "",
          type: "text",
        },
        last_name: {
          value: "",
          type: "text",
        },
        email: {
          value: "",
          type: "text",
        },
        username: {
          value: "",
          type: "text",
        },
      },
      sorts: {
        created_at: undefined,
      },
    },
    {
      singleSort: true,
    }
  );

  // ----------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={T("users_route_title")}
      description={T("users_route_description")}
      options={{
        noPadding: true,
      }}
      headingChildren={
        <Query.Row
          searchParams={searchParams}
          filters={[
            {
              label: T("first_name"),
              key: "first_name",
              type: "text",
            },
            {
              label: T("last_name"),
              key: "last_name",
              type: "text",
            },
            {
              label: T("email"),
              key: "email",
              type: "text",
            },
            {
              label: T("username"),
              key: "username",
              type: "text",
            },
          ]}
          sorts={[
            {
              label: T("created_at"),
              key: "created_at",
            },
          ]}
          perPage={[]}
        />
      }
    >
      <UsersTable searchParams={searchParams} />
    </Layout.PageLayout>
  );
};

export default UsersListRoute;
