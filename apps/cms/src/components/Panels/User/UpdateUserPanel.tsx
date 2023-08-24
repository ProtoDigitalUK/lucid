import T from "@/translations";
import {
  Component,
  Accessor,
  createMemo,
  createSignal,
  createEffect,
} from "solid-js";
// Services
import api from "@/services/api";
// Hooks
import helpers from "@/utils/helpers";
// Types
import { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";

interface UpdateUserPanelProps {
  id: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const UpdateUserPanel: Component<UpdateUserPanelProps> = (props) => {
  // ------------------------------
  // State
  const [getSelectedRoles, setSelectedRoles] = createSignal<
    SelectMultipleValueT[]
  >([]);

  // ---------------------------------
  // Queries
  const roles = api.roles.useGetMultiple({
    queryParams: {
      includes: {
        permissions: false,
      },
      perPage: -1,
    },
    enabled: () => !props.id(),
  });
  const user = api.users.useGetSingle({
    queryParams: {
      location: {
        user_id: props.id,
      },
    },
    enabled: () => !!props.id(),
  });

  // ---------------------------------
  // Mutations
  const updateUser = api.users.useUpdateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (user.isSuccess) {
      setSelectedRoles(
        user.data?.data.roles?.map((role) => {
          return {
            value: role.id,
            label: role.name,
          };
        }) || []
      );
    }
  });

  // ---------------------------------
  // Memos
  const isLoading = createMemo(() => {
    return user.isLoading || roles.isLoading;
  });
  const isError = createMemo(() => {
    return user.isError || roles.isError;
  });
  const updateData = createMemo(() => {
    return helpers.updateData(
      {
        role_ids: user.data?.data.roles?.map((role) => role.id),
      },
      {
        role_ids: getSelectedRoles().map((role) => role.value) as number[],
      }
    );
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        updateUser.action.mutate({
          id: props.id() as number,
          body: updateData().data,
        });
      }}
      reset={() => {
        updateUser.reset();
      }}
      fetchState={{
        isLoading: isLoading(),
        isError: isError(),
      }}
      mutateState={{
        isLoading: updateUser.action.isLoading,
        isDisabled: !updateData().changed,
        errors: updateUser.errors(),
      }}
      content={{
        title: T("update_user_panel_title"),
        description: T("update_user_panel_description"),
        submit: T("update"),
      }}
    >
      <Form.SelectMultiple
        id="roles"
        values={getSelectedRoles()}
        onChange={setSelectedRoles}
        name={"roles"}
        copy={{
          label: T("roles"),
        }}
        options={
          roles.data?.data.map((role) => {
            return {
              value: role.id,
              label: role.name,
            };
          }) || []
        }
      />
    </Panel.Root>
  );
};

export default UpdateUserPanel;
