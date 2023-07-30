import { Component } from "solid-js";
// Componetns
import PageLayout from "@/components/Layout/PageLayout";
import CreateEnvironment from "@/components/Forms/CreateEnvironmentForm";

const CreateEnvrionemntRoute: Component = () => {
  // ----------------------------------------
  // Render
  return (
    <PageLayout
      title="Create Environment"
      description="Environments are a top level grouping of collections, forms and bricks. With the seperation of environments, you can have multiple sites/apps running on the same CMS."
    >
      <CreateEnvironment />
    </PageLayout>
  );
};

export default CreateEnvrionemntRoute;
