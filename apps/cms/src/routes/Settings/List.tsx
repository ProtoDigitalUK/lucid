import T from "@/translations";
import { Component } from "solid-js";
// Componetns
import Layout from "@/components/Groups/Layout";

const SettingsListRoute: Component = () => {
  // ----------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={T("settings_route_title")}
      description={T("settings_route_description")}
      options={{
        noPadding: true,
      }}
      headingChildren={
        <Layout.NavigationTabs
          tabs={[
            {
              label: T("general"),
              href: "/settings",
            },
            {
              label: T("integrations"),
              href: "/settings/integrations",
            },
          ]}
        />
      }
    >
      ge
    </Layout.PageLayout>
  );
};

export default SettingsListRoute;
