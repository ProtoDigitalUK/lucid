import {
  Component,
  createSignal,
  Show,
  For,
  createMemo,
  createEffect,
} from "solid-js";
import slugify from "slugify";
// Utils
import helpers from "@/utils/helpers";

// Types
import { BrickConfigT } from "@lucid/types/src/bricks";
import { CollectionResT } from "@lucid/types/src/collections";
import { FormResT } from "@lucid/types/src/forms";
import { EnvironmentResT } from "@lucid/types/src/environments";
// Components
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import InputGrid from "@/components/Containers/InputGrid";
import CardGrid from "@/components/Containers/CardGrid";
import Layout from "@/components/Groups/Layout";
// Cards
import EnvBrickCard from "@/components/Cards/BrickCard";
import EnvCollectionCard from "@/components/Cards/CollectionCard";
import EnvFormCard from "@/components/Cards/FormCard";
// Hooks
import Queries from "@/hooks/queries";
import Mutations from "@/hooks/mutations";

interface CreateUpdateEnvFormProps {
  environment?: EnvironmentResT;
}

const CreateUpdateEnvForm: Component<CreateUpdateEnvFormProps> = (props) => {
  // ----------------------------------------
  // State
  const [title, setTitle] = createSignal("");
  const [key, setKey] = createSignal("");
  const [assignedBricks, setAssignedBricks] = createSignal<string[]>([]);
  const [assignedCollections, setAssignedCollections] = createSignal<string[]>(
    []
  );
  const [assignedForms, setAssignedForms] = createSignal<string[]>([]);

  // ----------------------------------------
  // Queries
  const bricks = Queries.BrickConfig.useGetAll({
    include: {
      fields: false,
    },
  });
  const collections = Queries.Collections.useGetAll({
    include: {
      bricks: false,
    },
  });
  const forms = Queries.Forms.useGetAll({
    include: {
      fields: false,
    },
  });

  // ----------------------------------------
  // Mutations
  const createEnvironment = Mutations.Environment.useCreate();
  const updateEnvironment = Mutations.Environment.useUpdate();

  // ----------------------------------------
  // Functions
  const toggleBrick = (brick: BrickConfigT) => {
    const index = assignedBricks().findIndex((key) => key === brick.key);
    if (index === -1) {
      setAssignedBricks([...assignedBricks(), brick.key]);
    } else {
      const newBricks = [...assignedBricks()];
      newBricks.splice(index, 1);
      setAssignedBricks(newBricks);
    }
  };
  const toggleCollection = (collection: CollectionResT) => {
    const index = assignedCollections().findIndex(
      (key) => key === collection.key
    );
    if (index === -1) {
      setAssignedCollections([...assignedCollections(), collection.key]);
    } else {
      const newCollections = [...assignedCollections()];
      newCollections.splice(index, 1);
      setAssignedCollections(newCollections);
    }
  };
  const toggleForm = (form: FormResT) => {
    const index = assignedForms().findIndex((key) => key === form.key);
    if (index === -1) {
      setAssignedForms([...assignedForms(), form.key]);
    } else {
      const newForms = [...assignedForms()];
      newForms.splice(index, 1);
      setAssignedForms(newForms);
    }
  };
  const setInitialValues = () => {
    if (props.environment) {
      setTitle(props.environment.title);
      setKey(props.environment.key);
      setAssignedBricks(props.environment.assigned_bricks);
      setAssignedCollections(props.environment.assigned_collections);
      setAssignedForms(props.environment.assigned_forms);
    }
  };

  // ----------------------------------------
  // Effects
  createEffect(() => {
    setInitialValues();
  });

  // ----------------------------------------
  // Memos
  const updateData = createMemo(() => {
    const body = helpers.deepDiff(
      {
        title: props.environment?.title,
        assigned_bricks: props.environment?.assigned_bricks,
        assigned_collections: props.environment?.assigned_collections,
        assigned_forms: props.environment?.assigned_forms,
      },
      {
        title: title(),
        assigned_bricks: assignedBricks(),
        assigned_collections: assignedCollections(),
        assigned_forms: assignedForms(),
      }
    );
    return {
      canUpdate: Object.keys(body).length > 0,
      body,
    };
  });
  const submitIsDisabled = createMemo(() => {
    if (!props.environment) return false;
    return !updateData().canUpdate;
  });

  // Query memos
  const isError = createMemo(() => {
    return bricks.isError || collections.isError || forms.isError;
  });
  const isLoading = createMemo(() => {
    return bricks.isLoading || collections.isLoading || forms.isLoading;
  });

  // Mutation memos
  const isCreating = createMemo(() => {
    return (
      createEnvironment.action.isLoading || updateEnvironment.action.isLoading
    );
  });
  const errors = createMemo(() => {
    if (!props.environment) return createEnvironment.errors();
    return updateEnvironment.errors();
  });

  // ----------------------------------------
  // Render
  return (
    <Layout.PageContent
      state={{
        isError: isError(),
      }}
    >
      <Form.Root
        type={"page-layout"}
        state={{
          isLoading: isCreating(),
          isDisabled: submitIsDisabled(),
          errors: errors(),
        }}
        content={{
          submit: props.environment ? "Update" : "Create",
        }}
        onSubmit={() => {
          if (!props.environment) {
            createEnvironment.action.mutate({
              key: key(),
              title: title(),
              assigned_bricks: assignedBricks(),
              assigned_collections: assignedCollections(),
              assigned_forms: assignedForms(),
            });
          } else {
            updateEnvironment.action.mutate({
              key: props.environment.key,
              body: updateData().body,
            });
          }
        }}
      >
        {/* Details */}
        <SectionHeading title="Details" />
        <InputGrid columns={3}>
          <Form.Input
            id="title"
            name="title"
            type="text"
            value={title()}
            onChange={setTitle}
            copy={{
              label: "Title",
            }}
            required={true}
            autoFoucs={true}
            errors={errors()?.errors?.body?.title}
            noMargin={true}
            onBlur={() => {
              if (!key()) {
                const newKey = slugify(title(), {
                  lower: true,
                  replacement: "-",
                  strict: true,
                  remove: /[0-9]/g,
                });
                setKey(newKey);
              }
            }}
          />
          <Show when={!props.environment}>
            <Form.Input
              id="key"
              name="key"
              type="text"
              value={key()}
              onChange={setKey}
              copy={{
                label: "Key",
              }}
              required={true}
              errors={errors()?.errors?.body?.key}
              noMargin={true}
            />
          </Show>
        </InputGrid>

        {/* Assigned Bricks */}
        <SectionHeading
          title="Bricks"
          description="Select the bricks you wish this environment to have access to."
        />
        <CardGrid
          columns={4}
          state={{
            isLoading: isLoading(),
            isError: isError(),
          }}
        >
          <For each={bricks.data?.data || []}>
            {(brick) => (
              <EnvBrickCard
                brick={brick}
                selectedBricks={assignedBricks()}
                setSelected={toggleBrick}
              />
            )}
          </For>
        </CardGrid>

        {/* Assigned Collections */}
        <SectionHeading
          title="Collections"
          description="Assign the collection you wish the environment to have access to."
        />
        <CardGrid
          columns={4}
          state={{
            isLoading: isLoading(),
            isError: isError(),
          }}
        >
          <For each={collections.data?.data || []}>
            {(collection) => (
              <EnvCollectionCard
                collection={collection}
                selectedCollections={assignedCollections()}
                setSelected={toggleCollection}
              />
            )}
          </For>
        </CardGrid>

        {/* Assigned Forms */}
        <SectionHeading
          title="Forms"
          description="Select the forms the environment should have access to."
        />
        <CardGrid
          columns={4}
          state={{
            isLoading: isLoading(),
            isError: isError(),
          }}
        >
          <For each={forms.data?.data || []}>
            {(form) => (
              <EnvFormCard
                form={form}
                selectedForms={assignedForms()}
                setSelected={toggleForm}
              />
            )}
          </For>
        </CardGrid>
      </Form.Root>
    </Layout.PageContent>
  );
};

export default CreateUpdateEnvForm;
