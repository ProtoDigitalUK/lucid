import T from "@/translations";
import {
  type Component,
  createSignal,
  Show,
  For,
  createMemo,
  createEffect,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Assets
import notifySvg from "@/assets/illustrations/notify.svg";
// Service
import api from "@/services/api";
// State
import { setEnvironment } from "@/state/environment";
// Types
import { BrickConfigT } from "@lucid/types/src/bricks";
import { CollectionResT } from "@lucid/types/src/collections";
import { FormResT } from "@lucid/types/src/forms";
import { EnvironmentResT } from "@lucid/types/src/environments";
// Components
import Form from "@/components/Partials/Form";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Partials/Button";
import SectionHeading from "@/components/Blocks/SectionHeading";
import InputGrid from "@/components/Containers/InputGrid";
import PageLayoutFooter from "@/components/Layout/PageLayoutFooter";
import ErrorMessage from "@/components/Partials/ErrorMessage";
import Error from "@/components/Partials/Error";
import CardGrid from "@/components/Containers/CardGrid";
// Cards
import EnvBrickCard from "@/components/Cards/BrickCard";
import EnvCollectionCard from "@/components/Cards/CollectionCard";
import EnvFormCard from "@/components/Cards/FormCard";

interface CreateEnvironmentProps {
  environment?: EnvironmentResT;
}

const CreateEnvironment: Component<CreateEnvironmentProps> = (props) => {
  // ----------------------------------------
  // State
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [errors, setErrors] = createSignal<APIErrorResponse>();

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
  // Mutations
  const createEnvironment = createMutation({
    mutationFn: api.environments.createSingle,
    onSuccess: (data) => {
      spawnToast({
        title: "Environment Created",
        message: "Your environment has been created successfully.",
        status: "success",
      });
      setEnvironment(data.data.key);
      navigate(`/env/${data.data.key}`);

      queryClient.invalidateQueries(["environments.getAll"]);
      queryClient.invalidateQueries(["environments.collections.getAll"]);
    },
    onError: (error) => validateSetError(error, setErrors),
  });
  const updateEnvironment = createMutation({
    mutationFn: api.environments.updateSingle,
    onSuccess: () => {
      spawnToast({
        title: "Environment Updated",
        message: "Your environment has been updated successfully.",
        status: "success",
      });

      queryClient.invalidateQueries(["environments.getSingle"]);
      queryClient.invalidateQueries(["environments.getAll"]);
      queryClient.invalidateQueries(["environments.collections.getAll"]);
    },
    onError: (error) => validateSetError(error, setErrors),
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
  const isError = createMemo(() => {
    return bricks.isError || collections.isError || forms.isError;
  });
  const isLoading = createMemo(() => {
    return bricks.isLoading || collections.isLoading || forms.isLoading;
  });

  const isSaving = createMemo(() => {
    return createEnvironment.isLoading || updateEnvironment.isLoading;
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
    <Form
      onSubmit={async () => {
        if (!props.environment) {
          createEnvironment.mutate({
            key: key(),
            title: title(),
            assigned_bricks: assignedBricks(),
            assigned_collections: assignedCollections(),
            assigned_forms: assignedForms(),
          });
        } else {
          updateEnvironment.mutate({
            key: key(),
            body: {
              title: title(),
              assigned_bricks: assignedBricks(),
              assigned_collections: assignedCollections(),
              assigned_forms: assignedForms(),
            },
          });
        }
      }}
    >
      {/* Details */}
      <SectionHeading title="Details" />
      <InputGrid columns={3}>
        <Input
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
        />
        <Show when={!props.environment}>
          <Input
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

      <PageLayoutFooter>
        <Show when={errors() && errors()?.message}>
          <div class="mb-5">
            <ErrorMessage message={errors()?.message} />
          </div>
        </Show>
        <Button type="submit" theme="primary" loading={isSaving()}>
          <Show when={props.environment}>Update</Show>
          <Show when={!props.environment}>Create</Show>
        </Button>
      </PageLayoutFooter>
    </Form>
  );
};

export default CreateEnvironment;
