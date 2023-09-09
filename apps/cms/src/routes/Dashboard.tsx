import { Component } from "solid-js";
import T from "@/translations";
// Services
import api from "@/services/api";
// Store
import userStore from "@/store/userStore";
// Hooks
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
// Components
import Button from "@/components/Partials/Button";
import Layout from "@/components/Groups/Layout";
import StartingPoints from "@/components/Blocks/StartingPoints";

const DashboardRoute: Component = () => {
  // ----------------------------------------
  // Hooks
  const MediaImage = useSingleFileUpload({
    id: "media-image",
    currentFile: {
      type: "image",
      url: "http://localhost:8393/cdn/v1/rum-ham-1693737773099",
      name: "rum-ham-1693737773099",
    },
    disableRemoveCurrent: true,
    name: "media-image",
    copy: {
      label: "Image",
      describedBy: "Should be a .jpg or .png file.",
    },
    required: true,
    disabled: false,
    errors: {},
    noMargin: false,
  });

  // ----------------------------------------
  // Mutations
  const logout = api.auth.useLogout();

  // ----------------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={T("dashboard_route_title", {
        name: userStore.get.user?.first_name
          ? `, ${userStore.get.user?.first_name}`
          : "",
      })}
      description={T("dashboard_route_description")}
    >
      <Layout.PageContent>
        <StartingPoints />
        <Button
          type="submit"
          theme="primary"
          size="medium"
          loading={logout.action.isLoading}
          onClick={() => logout.action.mutate()}
        >
          {T("logout")}
        </Button>
        <div class="mt-10 max-w-4xl mx-auto">
          <MediaImage.Render />
        </div>
      </Layout.PageContent>
    </Layout.PageLayout>
  );
};

export default DashboardRoute;
