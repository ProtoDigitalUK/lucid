import T from "@/translations";
import { Component, Accessor } from "solid-js";
// Services
import api from "@/services/api";
// Utils
// Components
import Panel from "@/components/Groups/Panel";
import SectionHeading from "@/components/Blocks/SectionHeading";
import DetailsList from "@/components/Partials/DetailsList";
import JSONPreview from "@/components/Partials/JSONPreview";

interface PreviewEmailPanelProps {
  id: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const PreviewEmailPanel: Component<PreviewEmailPanelProps> = (props) => {
  // ---------------------------------
  // Queries
  const email = api.email.useGetSingle({
    queryParams: {
      location: {
        email_id: props.id,
      },
    },
    enabled: () => !!props.id(),
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      reset={() => {}}
      hideFooter={true}
      fetchState={{
        isLoading: email.isLoading,
        isError: email.isError,
      }}
      content={{
        title: T("preview_email_panel_title"),
      }}
    >
      {() => (
        <>
          <SectionHeading title={T("details")} />
          <DetailsList
            type="text"
            items={[
              {
                label: T("subject"),
                value: email.data?.data.mail_details.subject || undefined,
              },
              {
                label: T("template"),
                value: email.data?.data.mail_details.template || undefined,
              },
              {
                label: T("to"),
                value: email.data?.data.mail_details.to || undefined,
              },
              {
                label: T("from"),
                value: email.data?.data.mail_details.from.address || undefined,
              },
              {
                label: T("status"),
                value: email.data?.data.delivery_status || undefined,
              },
              {
                label: T("sent_count"),
                value: email.data?.data.sent_count || 0,
              },
              {
                label: T("type"),
                value: email.data?.data.type || undefined,
              },
            ]}
          />

          <SectionHeading title={T("data")} />
          <JSONPreview
            title={T("view_data")}
            json={email.data?.data.data || {}}
          />

          <SectionHeading title={T("preview")} />

          <div class="border border-border rounded-md overflow-hidden">
            <iframe
              class="w-full h-96"
              srcdoc={email.data?.data.html || ""}
              title="Preview"
            />
          </div>
        </>
      )}
    </Panel.Root>
  );
};

export default PreviewEmailPanel;
