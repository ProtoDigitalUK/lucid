import T from "@/translations";
import {
  type Component,
  createSignal,
  Show,
  For,
  createMemo,
  createEffect,
} from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import slugify from "slugify";
// Utils
import helpers from "@/utils/helpers";
// Assets
import notifySvg from "@/assets/illustrations/notify.svg";
// Service
import api from "@/services/api";
// Types
import { BrickConfigT } from "@lucid/types/src/bricks";
import { CollectionResT } from "@lucid/types/src/collections";
import { FormResT } from "@lucid/types/src/forms";
import { EnvironmentResT } from "@lucid/types/src/environments";
// Components
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";
import SectionHeading from "@/components/Blocks/SectionHeading";
import InputGrid from "@/components/Containers/InputGrid";
import ErrorMessage from "@/components/Partials/ErrorMessage";
import Error from "@/components/Partials/Error";
import CardGrid from "@/components/Containers/CardGrid";
import Layout from "@/components/Groups/Layout";
// Cards
import EnvBrickCard from "@/components/Cards/BrickCard";
import EnvCollectionCard from "@/components/Cards/CollectionCard";
import EnvFormCard from "@/components/Cards/FormCard";
// Actions
import Actions from "@/components/Actions";

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
  const bricks = createQuery(() => ["brickConfig.getAll"], {
    queryFn: () =>
      api.brickConfig.getAll({
        include: {
          fields: false,
        },
      }),
  });
  const collections = createQuery(() => ["environments.collections.getAll"], {
    queryFn: () =>
      api.environments.collections.getAll({
        include: {
          bricks: false,
        },
      }),
  });
  const forms = createQuery(() => ["environments.forms.getAll"], {
    queryFn: () =>
      api.environments.forms.getAll({
        include: {
          fields: false,
        },
      }),
  });

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
  }, [props.environment]);

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

  const isError = createMemo(() => {
    return bricks.isError || collections.isError || forms.isError;
  });
  const isLoading = createMemo(() => {
    return bricks.isLoading || collections.isLoading || forms.isLoading;
  });

  // ----------------------------------------
  // Render
  if (isError()) {
    return (
      <Error
        type="page-layout"
        content={{
          image: notifySvg,
          title: T.state.error_title,
          description: T.state.error_message,
        }}
      />
    );
  }

  return (
    <Actions.Environment.CreateUpdate>
      {(createUpdate) => (
        <Form.Root
          onSubmit={() => {
            if (!props.environment) {
              createUpdate.mutate.create({
                key: key(),
                title: title(),
                assigned_bricks: assignedBricks(),
                assigned_collections: assignedCollections(),
                assigned_forms: assignedForms(),
              });
            } else {
              createUpdate.mutate.update({
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
              errors={createUpdate.errors?.errors?.body?.title}
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
                errors={createUpdate.errors?.errors?.body?.key}
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

          <Layout.PageFooter>
            <Show when={createUpdate.errors && createUpdate.errors?.message}>
              <ErrorMessage
                theme="background"
                message={createUpdate.errors?.message}
              />
            </Show>
            <Button
              type="submit"
              theme="primary"
              size="medium"
              loading={createUpdate.isLoading}
              disabled={submitIsDisabled()}
            >
              <Show when={props.environment}>Update</Show>
              <Show when={!props.environment}>Create</Show>
            </Button>
          </Layout.PageFooter>
        </Form.Root>
      )}
    </Actions.Environment.CreateUpdate>
  );
};

export default CreateUpdateEnvForm;
