import { type Component, createSignal, Show } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { Link, useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Service
import api from "@/services/api";
// Components
import Form from "@/components/Partials/Form";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Partials/Button";

interface CreateEnvironmentProps {}

const CreateEnvironment: Component<CreateEnvironmentProps> = (props) => {
  // ----------------------------------------
  // State
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  const [title, setTitle] = createSignal("");
  const [key, setKey] = createSignal("");
  const [assignedBricks, setAssignedBricks] = createSignal<string[]>([]);
  const [assignedCollections, setAssignedCollections] = createSignal<string[]>(
    []
  );
  const [assignedForms, setAssignedForms] = createSignal<string[]>([]);

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
      <Input
        id="assignedBricks"
        name="assignedBricks"
        type="text"
        value={assignedBricks().toString()}
        onChange={setAssignedBricks}
        copy={{
          label: "Assigned Bricks",
        }}
        required={true}
        errors={errors()?.errors?.body?.assignedBricks}
      />
      <Input
        id="assignedCollections"
        name="assignedCollections"
        type="text"
        value={assignedCollections().toString()}
        onChange={setAssignedCollections}
        copy={{
          label: "Assigned Collections",
        }}
        required={true}
        errors={errors()?.errors?.body?.assignedCollections}
      />
      <Input
        id="assignedForms"
        name="assignedForms"
        type="text"
        value={assignedForms().toString()}
        onChange={setAssignedForms}
        copy={{
          label: "Assigned Forms",
        }}
        required={true}
        errors={errors()?.errors?.body?.assignedForms}
      />

      <div class="flex flex-col items-start">
        <div class="mt-10 w-full">
          <Show when={errors()}>
            <p class="text-red-500 text-sm mb-5">{errors()?.message}</p>
          </Show>

          <Button
            class="w-full"
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
