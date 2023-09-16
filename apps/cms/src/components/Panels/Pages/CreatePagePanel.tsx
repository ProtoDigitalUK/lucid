import T from "@/translations";
import { Component, createSignal } from "solid-js";
// Services
import api from "@/services/api";
// Types
import { CollectionResT } from "@lucid/types/src/collections";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";

interface CreatePagePanelProps {
  collection: CollectionResT;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const CreatePagePanel: Component<CreatePagePanelProps> = (props) => {
  // ------------------------------
  // State
  const [getTitle, setTitle] = createSignal<string | undefined>(undefined);
  const [getSlug, setSlug] = createSignal<string | undefined>(undefined);
  const [getIsHomepage, setIsHomepage] = createSignal<boolean>(false);

  // ---------------------------------
  // Mutations
  const createPage = api.media.useCreateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        createPage.action.mutate({
          body: {},
        });
      }}
      reset={() => {
        createPage.reset();
      }}
      mutateState={{
        isLoading: createPage.action.isLoading,
        errors: createPage.errors(),
      }}
      content={{
        title: T("create_page_panel_title"),
        description: T("create_page_panel_description", {
          collection: {
            value: props.collection.title,
            toLowerCase: true,
          },
        }),
        submit: T("create"),
      }}
    >
      <SectionHeading title={T("details")} />
      <Form.Input
        id="name"
        value={getTitle() || ""}
        onChange={setTitle}
        name={"title"}
        type="text"
        copy={{
          label: T("title"),
        }}
        errors={createPage.errors()?.errors?.body?.title}
      />
      <Form.Input
        id="slug"
        value={getSlug() || ""}
        onChange={setSlug}
        name={"slug"}
        type="text"
        copy={{
          label: T("slug"),
        }}
        errors={createPage.errors()?.errors?.body?.slug}
      />
      <Form.Checkbox
        id="homepage"
        value={getIsHomepage()}
        onChange={setIsHomepage}
        name={"homepage"}
        copy={{
          label: T("is_homepage"),
        }}
        errors={createPage.errors()?.errors?.body?.homepage}
      />
    </Panel.Root>
  );
};

export default CreatePagePanel;
