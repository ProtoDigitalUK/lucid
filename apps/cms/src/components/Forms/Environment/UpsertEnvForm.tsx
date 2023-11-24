import T from "@/translations";
import {
  Component,
  createSignal,
  Show,
  For,
  createMemo,
  createEffect,
} from "solid-js";
import slugify from "slugify";
// Store
import userStore from "@/store/userStore";
// Services
import api from "@/services/api";
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
// Cards
import EnvBrickCard from "@/components/Cards/BrickCard";
import EnvCollectionCard from "@/components/Cards/CollectionCard";
import EnvFormCard from "@/components/Cards/FormCard";

interface UpsertEnvFormProps {
  environment?: EnvironmentResT;
}

const UpsertEnvForm: Component<UpsertEnvFormProps> = (props) => {
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
  const bricks = api.brickConfig.useGetAll({
    queryParams: {
      include: {
        fields: false,
      },
    },
  });
  const collections = api.environment.collections.useGetAll({
    queryParams: {
      include: {
        bricks: false,
      },
    },
  });
  const forms = api.environment.forms.useGetAll({
    queryParams: {
      include: {
        fields: false,
      },
    },
  });

  // ----------------------------------------
  // Mutations
  const createEnvironment = api.environment.useCreateSingle();
  const updateEnvironment = api.environment.useUpdateSingle();

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
    return helpers.updateData(
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
  });
  const submitIsDisabled = createMemo(() => {
    if (!props.environment) return false;
    return !updateData().changed;
  });
  const hasPermission = createMemo(() => {
    if (props.environment) {
      return userStore.get.hasPermission(["update_environment"]).all;
    }
    return userStore.get.hasPermission(["create_environment"]).all;
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
      createEnvironment.action.isPending || updateEnvironment.action.isPending
    );
  });
  const errors = createMemo(() => {
    if (!props.environment) return createEnvironment.errors();
    return updateEnvironment.errors();
  });

  // ----------------------------------------
  // Render
  return (
    <Form.Root
      type={"page-layout"}
      permission={hasPermission()}
      queryState={{
        isError: isError(),
      }}
      state={{
        isLoading: isCreating(),
        isDisabled: submitIsDisabled(),
        errors: errors(),
      }}
      content={{
        submit: props.environment ? T("update") : T("create"),
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
            body: updateData().data,
          });
        }
      }}
    >
      {/* Details */}
      <SectionHeading title={T("details")} />
      <InputGrid columns={3}>
        <Form.Input
          id="title"
          name="title"
          type="text"
          value={title()}
          onChange={setTitle}
          copy={{
            label: T("title"),
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
              label: T("key"),
            }}
            required={true}
            errors={errors()?.errors?.body?.key}
            noMargin={true}
          />
        </Show>
      </InputGrid>

      {/* Assigned Bricks */}
      <SectionHeading
        title={T("bricks")}
        description={T("assign_bricks_description")}
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
        title={T("collections")}
        description={T("assign_collections_description")}
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
        title={T("forms")}
        description={T("assign_forms_description")}
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
  );
};

export default UpsertEnvForm;
