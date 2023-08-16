import { Component, createSignal } from "solid-js";
// Services
import api from "@/services/api";
// State
import { environment } from "@/state/environment";
// Components
import Layout from "@/components/Groups/Layout";
import CreateUpdateEnvForm from "@/components/Forms/Environment/CreateUpdateEnvForm";
// Modals
import DeleteEnvironment from "@/components/Modals/Environment/DeleteEnvironment";

const ManageEnvrionemntRoute: Component = () => {
  // ----------------------------------------
  // State
  const [openDelete, setOpenDelete] = createSignal(false);

  // ----------------------------------------
  // Queries
  const environmentData = api.environments.useGetSingle({
    queryParams: {
      location: {
        environment_key: environment,
      },
    },
    enabled: () => environment() !== undefined,
  });

  // ----------------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={environmentData.data?.data.title || "Manage Environment"}
      description="Environments are a top level grouping of collections, forms and bricks. With the seperation of environments, you can have multiple sites/apps running on the same CMS."
      state={{
        isLoading: environmentData.isLoading,
        isError: environmentData.isError,
        isSuccess: environmentData.isSuccess,
      }}
      actions={{
        delete: {
          open: openDelete(),
          setOpen: setOpenDelete,
        },
      }}
    >
      {/* Content */}
      <CreateUpdateEnvForm environment={environmentData.data?.data} />
      {/* Modals */}
      <DeleteEnvironment
        key={environmentData.data?.data.key}
        state={{
          open: openDelete(),
          setOpen: setOpenDelete,
        }}
      />
    </Layout.PageLayout>
  );
};

export default ManageEnvrionemntRoute;
