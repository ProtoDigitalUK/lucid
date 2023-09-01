import T from "@/translations";
import { Component, createSignal } from "solid-js";
// Services
import api from "@/services/api";
// Store
import { environment } from "@/store/environmentStore";
import userStore from "@/store/userStore";
// Components
import Layout from "@/components/Groups/Layout";
import UpsertEnvForm from "@/components/Forms/Environment/UpsertEnvForm";
// Modals
import DeleteEnvironment from "@/components/Modals/Environment/DeleteEnvironment";

const ManageEnvrionemntRoute: Component = () => {
  // ----------------------------------------
  // State
  const [openDelete, setOpenDelete] = createSignal(false);

  // ----------------------------------------
  // Queries
  const environmentData = api.environment.useGetSingle({
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
      title={T("manage_environment_route_title", {
        title: environmentData.data?.data.title ?? "",
      })}
      description={T("manage_environment_route_description")}
      state={{
        isLoading: environmentData.isLoading,
        isError: environmentData.isError,
        isSuccess: environmentData.isSuccess,
      }}
      actions={{
        delete: {
          open: openDelete(),
          setOpen: setOpenDelete,
          permission: userStore.get.hasPermission(["delete_environment"]).all,
        },
      }}
    >
      <Layout.PageContent>
        <UpsertEnvForm environment={environmentData.data?.data} />
        <DeleteEnvironment
          key={environmentData.data?.data.key}
          state={{
            open: openDelete(),
            setOpen: setOpenDelete,
          }}
        />
      </Layout.PageContent>
    </Layout.PageLayout>
  );
};

export default ManageEnvrionemntRoute;
