import { Component } from "solid-js";
// Componetns
import Layout from "@/components/Groups/Layout";
import CreateEnvironment from "@/components/Forms/Environments/CreateEnvironmentForm";

const CreateEnvrionemntRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <Layout.PageLayout
      title="Create Environment"
      description="Environments are a top level grouping of collections, forms and bricks. With the seperation of environments, you can have multiple sites/apps running on the same CMS."
    >
      <CreateEnvironment />
    </Layout.PageLayout>
  );
};

export default CreateEnvrionemntRoute;
