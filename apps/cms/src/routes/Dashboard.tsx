import { Component, createSignal } from "solid-js";
import T from "@/translations";
// Services
import api from "@/services/api";
// Store
import userStore from "@/store/userStore";
// Components
import Button from "@/components/Partials/Button";
import Form from "@/components/Groups/Form";
import Layout from "@/components/Groups/Layout";

const DashboardRoute: Component = () => {
  // ----------------------------------------
  // State
  const [getFile, setGetFile] = createSignal<File | null>(null);
  const [getRemovedCurrent, setGetRemovedCurrent] =
    createSignal<boolean>(false);

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
        <Button
          type="submit"
          theme="primary"
          size="medium"
          loading={logout.action.isLoading}
          onClick={() => logout.action.mutate()}
        >
          {T("logout")}
        </Button>
        <Form.SingleFileUpload
          id={"file-upload"}
          state={{
            value: getFile(),
            setValue: setGetFile,
            removedCurrent: getRemovedCurrent(),
            setRemovedCurrent: setGetRemovedCurrent,
          }}
          currentFile={{
            type: "image",
            url: "http://localhost:8393/cdn/v1/rum-ham-1693737773099",
            name: "rum-ham-1693737773099",
          }}
          name={"file-upload"}
          copy={{
            label: "Image",
            describedBy: "Should be a .jpg or .png file.",
          }}
          required={true}
          disabled={false}
          errors={{}}
          noMargin={false}
        />
      </Layout.PageContent>
    </Layout.PageLayout>
  );
};

export default DashboardRoute;
