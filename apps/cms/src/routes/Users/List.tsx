import T from "@/translations";
import { Component, Index } from "solid-js";
import { FaSolidT, FaSolidCircle, FaSolidCalendar } from "solid-icons/fa";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import Table from "@/components/Groups/Table";
import UserRow from "@/components/Tables/Rows/UserRow";

const users: Array<{
  first_name: string;
  last_name: string;
  role: string;
  favorite_color: string;
  notes: string;
  created_at: string;
  updated_at: string;
}> = [
  {
    first_name: "John",
    last_name: "Doe",
    role: "Admin",
    favorite_color: "Blue",
    notes: "",
    created_at: "2021-01-01T00:00:00.000000Z",
    updated_at: "2021-01-01T00:00:00.000000Z",
  },
  {
    first_name: "Jane",
    last_name: "Doe",
    role: "User",
    favorite_color: "Red",
    notes: "",
    created_at: "2021-01-01T00:00:00.000000Z",
    updated_at: "2021-01-01T00:00:00.000000Z",
  },
  {
    first_name: "John",
    last_name: "Smith",
    role: "User",
    favorite_color: "Green",
    notes: "",
    created_at: "2021-01-01T00:00:00.000000Z",
    updated_at: "2021-01-01T00:00:00.000000Z",
  },
];

const UsersListRoute: Component = () => {
  const searchParams = useSearchParams(
    {
      filters: {
        first_name: {
          value: "John",
          type: "text",
        },
        last_name: {
          value: "",
          type: "text",
        },
        email: {
          value: undefined,
          type: "boolean",
        },
        username: {
          value: [],
          type: "array",
        },
      },
      sorts: {
        created_at: undefined,
        updated_at: undefined,
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
              type: "select",
              options: [
                {
                  label: "One",
                  value: "bobby",
                },
                {
                  label: "Two",
                  value: "johnny",
                },
              ],
            },
            {
              label: T("email"),
              key: "email",
              type: "boolean",
            },
            {
              label: T("username"),
              key: "username",
              type: "multi-select",
              options: [
                {
                  label: "One",
                  value: "bobby",
                },
                {
                  label: "Two",
                  value: "johnny",
                },
              ],
            },
          ]}
          sorts={[
            {
              label: T("created_at"),
              key: "created_at",
            },
            {
              label: T("updated_at"),
              key: "updated_at",
            },
          ]}
          perPage={[]}
        />
      }
    >
      <Table.Root
        key={"users.list"}
        rows={users.length}
        meta={{
          path: "",
          links: [],
          current_page: 1,
          per_page: 10,
          total: 100,
          last_page: 10,
        }}
        searchParams={searchParams}
        head={[
          {
            label: T("first_name"),
            key: "first_name",
            icon: <FaSolidT />,
          },
          {
            label: T("last_name"),
            key: "last_name",
            icon: <FaSolidT />,
          },
          {
            label: T("role"),
            key: "role",
            icon: <FaSolidCircle />,
          },
          {
            label: "Favorite Color",
            key: "favorite_color",
            icon: <FaSolidCalendar />,
          },
          {
            label: "Notes",
            key: "notes",
            icon: <FaSolidCalendar />,
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
            sortable: true,
          },
        ]}
        state={{
          isLoading: false,
          isError: false,
          isSuccess: true,
        }}
        options={{
          isSelectable: true,
        }}
        callbacks={{
          deleteRows: () => {
            alert("Delete rows");
          },
        }}
      >
        {({ include, isSelectable, selected, setSelected }) => (
          <Index each={users}>
            {(user, i) => (
              <UserRow
                index={i}
                user={user()}
                include={include}
                selected={selected[i]}
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
    </Layout.PageLayout>
  );
};

export default UsersListRoute;
