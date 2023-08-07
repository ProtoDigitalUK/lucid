import { Component, Index } from "solid-js";
import { FaSolidT, FaSolidCircle, FaSolidCalendar } from "solid-icons/fa";
// Hooks
import useSearchParams from "@/hooks/useSearchParams2";
// Componetns
import Layout from "@/components/Groups/Layout";
import Table from "@/components/Groups/Table";
import UserRow from "@/components/Tables/Rows/UserRow";

const users = [
  {
    first_name: "John",
    last_name: "Doe",
    role: "Admin",
    favorite_color: "Blue",
    notes: "",
  },
  {
    first_name: "Jane",
    last_name: "Doe",
    role: "User",
    favorite_color: "Red",
    notes: "",
  },
  {
    first_name: "John",
    last_name: "Smith",
    role: "User",
    favorite_color: "Green",
    notes: "",
  },
];

const UsersListRoute: Component = () => {
  const searchParams = useSearchParams({
    filters: {
      first_name: "default",
      last_name: "default",
      email: "",
      username: "",
    },
    sorts: {
      created_at: "desc",
    },
  });

  // ----------------------------------
  // Render
  return (
    <Layout.PageLayout
      title="User"
      description="Manage users and their permissions."
      options={{
        noPadding: true,
      }}
    >
      <button
        onClick={() => {
          searchParams.setParams({
            filters: {
              first_name: "set",
              last_name: "set",
            },
            sorts: {
              created_at: undefined,
            },
          });
        }}
      >
        <span>filter</span>
      </button>
      <div class="w-full p-2.5 bg-container border-border border">
        {searchParams.getQueryString()}
      </div>
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
        caption="Users"
        head={[
          {
            label: "First Name",
            key: "first_name",
            icon: <FaSolidT />,
          },
          {
            label: "Last Name",
            key: "last_name",
            icon: <FaSolidT />,
          },
          {
            label: "Role",
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
