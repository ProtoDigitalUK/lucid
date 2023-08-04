import { Component } from "solid-js";
// Componetns
import Layout from "@/components/Groups/Layout";
import CreateUpdateEnvForm from "@/components/Forms/Environment/CreateUpdateEnvForm";

const CreateEnvrionemntRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <Layout.PageLayout
      title="Create Environment"
      description="Environments are a top level grouping of collections, forms and bricks. With the seperation of environments, you can have multiple sites/apps running on the same CMS."
    >
      <CreateUpdateEnvForm />
    </Layout.PageLayout>
  );
};

export default CreateEnvrionemntRoute;
