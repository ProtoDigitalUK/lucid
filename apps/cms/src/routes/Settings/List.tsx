import T from "@/translations";
import { Component, Match, Switch, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";
// Componetns
import Layout from "@/components/Groups/Layout";
import InfoRow from "@/components/Partials/InfoRow";
import Button from "@/components/Partials/Button";

const SettingsListRoute: Component = () => {
  const location = useLocation();

  // ----------------------------------
  // Memos
  const currentTab = createMemo(() => {
    const path = location.pathname;
    if (path === "/settings") return "general";
    if (path === "/settings/integrations") return "integrations";
    return "";
  });

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
      <Layout.PageContent>
        <Switch>
          <Match when={currentTab() === "general"}>
            <InfoRow.Root
              title="Processed Images"
              description="Each image can have a maximum of 10 processed images. These do not count towards your storage limit"
            >
              <InfoRow.Content
                title="Clear all"
                description="After clearing all your processed images, it's recommended to review each page of your client(s) to reprocess the images. The first load will take longer since that's when processing occurs."
              >
                <Button size="small" type="submit" theme="danger">
                  Clear all
                </Button>
              </InfoRow.Content>
            </InfoRow.Root>
          </Match>
          <Match when={currentTab() === "integrations"}>
            integrations settings
          </Match>
        </Switch>
      </Layout.PageContent>
    </Layout.PageLayout>
  );
};

export default SettingsListRoute;
