import { Component } from "solid-js";
// Componetns
import Layout from "@/components/Groups/Layout";
import Table from "@/components/Groups/Table";

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
        caption="Users"
      >
        {({ include }) => (
          <>
            <tr>
              <Table.Td include={include[0]}>James</Table.Td>
              <Table.Td include={include[1]}>Matman</Table.Td>
              <Table.Td include={include[2]}>Chief Sandwich Eater</Table.Td>
              <Table.Td include={include[3]}>Lettuce Green</Table.Td>
              <Table.Td include={include[4]}>Trek</Table.Td>
            </tr>
            <tr>
              <Table.Td include={include[0]}>The</Table.Td>
              <Table.Td include={include[1]}>Tick</Table.Td>
              <Table.Td include={include[2]}>Crimefighter Sorta</Table.Td>
              <Table.Td include={include[3]}>Blue</Table.Td>
              <Table.Td include={include[4]}>The City</Table.Td>
            </tr>
          </>
        )}
      </Table.Root>
    </Layout.PageLayout>
  );
};

export default UsersListRoute;
