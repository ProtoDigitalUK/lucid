import { Component, createSignal } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Services
import api from "@/services/api";
// State
import { environment } from "@/state/environment";
// Components
import PageLayout from "@/components/Layout/PageLayout";
import CreateEnvironment from "@/components/Forms/CreateEnvironmentForm";
// Modals
import DeleteEnvironment from "@/components/Modals/Environments/DeleteEnvironment";

const ManageEnvrionemntRoute: Component = () => {
  // ----------------------------------------
  // State
  const [openDelete, setOpenDelete] = createSignal(false);

  // ----------------------------------------
  // Queries
  const environmentData = createQuery(
    () => ["environments.getSingle", environment()],
    {
      queryFn: () =>
        api.environments.getSingle({
          key: environment() as string,
        }),
      enabled: environment() !== undefined,
    }
  );

  // ----------------------------------------
  // Render
  return (
    <PageLayout
      title={environmentData.data?.data.title || "Manage Environment"}
      description="Environments are a top level grouping of collections, forms and bricks. With the seperation of environments, you can have multiple sites/apps running on the same CMS."
      state={{
        isLoading: environmentData.isLoading,
        isError: environmentData.isError,
        isSuccess: environmentData.isSuccess,
      }}
    >
      <button
        class=""
        onClick={() => {
          setOpenDelete(true);
        }}
      >
        Delete Environment
      </button>
      <DeleteEnvironment
        state={{
          open: openDelete(),
          setOpen: setOpenDelete,
        }}
      />
      <CreateEnvironment environment={environmentData.data?.data} />
    </PageLayout>
  );
};

export default ManageEnvrionemntRoute;
