import T from "@/translations";
import { Component } from "solid-js";
// Componetns
import Layout from "@/components/Groups/Layout";
import UpsertEnvForm from "@/components/Forms/Environment/UpsertEnvForm";

const CreateEnvrionemntRoute: Component = () => {
	// ----------------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T("create_environment_route_title")}
			description={T("create_environment_route_description")}
		>
			<UpsertEnvForm />
		</Layout.PageLayout>
	);
};

export default CreateEnvrionemntRoute;
