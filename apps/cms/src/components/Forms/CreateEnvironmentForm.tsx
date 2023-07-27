import { type Component, createSignal, Show } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Service
import api from "@/services/api";
// Components
import Form from "@/components/Partials/Form";
import Input from "@/components/Inputs/Input";
import SelectMultiple, {
  SelectMultipleValueT,
} from "@/components/Inputs/SelectMultiple";
import Button from "@/components/Partials/Button";

interface CreateEnvironmentProps {}

const CreateEnvironment: Component<CreateEnvironmentProps> = (props) => {
  // ----------------------------------------
  // State
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  const [title, setTitle] = createSignal("");
  const [key, setKey] = createSignal("");
  const [assignedBricks, setAssignedBricks] = createSignal<
    SelectMultipleValueT[]
  >([
    {
      value: 1,
      label: "Brick 1",
    },
    {
      value: 2,
      label: "Brick 2",
    },
  ]);
  const [assignedCollections, setAssignedCollections] = createSignal<
    SelectMultipleValueT[]
  >([]);
  const [assignedForms, setAssignedForms] = createSignal<
    SelectMultipleValueT[]
  >([]);

  // ----------------------------------------
  // Queries / Mutations
  const login = createMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      spawnToast({
        title: "Login successful",
        message: "You have been logged in",
        status: "success",
      });
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ----------------------------------------
  // Render
  return (
    <Form onSubmit={async () => {}}>
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
      />
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
      />
      <SelectMultiple
        id="assignedBricks"
        name="assignedBricks"
        values={assignedBricks()}
        onChange={setAssignedBricks}
        options={[
          {
            value: 1,
            label: "Brick 1",
          },
          {
            value: 2,
            label: "Brick 2",
          },
          {
            value: 3,
            label: "Brick 3",
          },
          {
            value: 4,
            label: "Brick 4",
          },
          {
            value: 5,
            label: "Brick 5",
          },
          {
            value: 6,
            label: "Brick 6",
          },
          {
            value: 7,
            label: "Brick 7",
          },
          {
            value: 8,
            label: "Brick 8",
          },
          {
            value: 9,
            label: "Brick 9",
          },
          {
            value: 10,
            label: "Brick 10",
          },
        ]}
        copy={{
          label: "Assigned Bricks",
        }}
        required={true}
        errors={errors()?.errors?.body?.assignedBricks}
      />

      <div class="flex flex-col items-start">
        <div class="mt-10 w-full">
          <Show when={errors()}>
            <p class="text-red-500 text-sm mb-5">{errors()?.message}</p>
          </Show>

          <Button
            classes="w-full"
            type="submit"
            theme="primary"
            loading={login.isLoading}
          >
            Create Environment
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateEnvironment;
