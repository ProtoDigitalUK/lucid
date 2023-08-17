import T from "@/translations";
import { Component } from "solid-js";
// Componetns
import Layout from "@/components/Groups/Layout";
import CreateUpdateEnvForm from "@/components/Forms/Environment/CreateUpdateEnvForm";

const CreateEnvrionemntRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={T("create_environment_route_title")}
      description={T("create_environment_route_description")}
    >
      <CreateUpdateEnvForm />
    </Layout.PageLayout>
  );
};

export default CreateEnvrionemntRoute;
