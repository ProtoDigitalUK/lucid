import { Component, Index } from "solid-js";
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
      <Table.Root
        head={[
          {
            label: "First Name",
            key: "first_name",
          },
          {
            label: "Last Name",
            key: "last_name",
          },
          {
            label: "Role",
            key: "role",
          },
          {
            label: "Favorite Color",
            key: "favorite_color",
          },
          {
            label: "Notes",
            key: "notes",
          },
        ]}
        state={{
          isLoading: false,
          isError: false,
          isSuccess: true,
        }}
        data={{
          rows: users.length,
          meta: {
            path: "",
            links: [],
            current_page: 1,
            per_page: 10,
            total: 100,
            last_page: 10,
          },
        }}
        content={{
          caption: "Users",
        }}
        callbacks={{
          deleteRows: () => {
            alert("Delete rows");
          },
        }}
        options={{
          isSelectable: true,
        }}
      >
        {({ include, isSelectable, selected, setSelected }) => (
          <Index each={users}>
            {(user, i) => (
              <Table.Tr
                options={{
                  isSelectable,
                }}
                data={{
                  index: i,
                  selected: selected[i],
                }}
                callbacks={{
                  setSelected: setSelected,
                }}
              >
                <UserRow
                  data={{
                    user: user(),
                    include: include,
                  }}
                />
              </Table.Tr>
            )}
          </Index>
        )}
      </Table.Root>
    </Layout.PageLayout>
  );
};

export default UsersListRoute;
