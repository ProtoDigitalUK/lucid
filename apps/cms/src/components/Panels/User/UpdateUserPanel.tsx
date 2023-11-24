import T from "@/translations";
import {
  Component,
  Accessor,
  createMemo,
  createSignal,
  createEffect,
  Show,
} from "solid-js";
// Services
import api from "@/services/api";
// Store
import userStore from "@/store/userStore";
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
  const [getIsSuperAdmin, setIsSuperAdmin] = createSignal<boolean>(false);

  // ---------------------------------
  // Queries
  const roles = api.roles.useGetMultiple({
    queryParams: {
      include: {
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
      setIsSuperAdmin(user.data?.data.super_admin || false);
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
        super_admin: user.data?.data.super_admin,
      },
      {
        role_ids: getSelectedRoles().map((role) => role.value) as number[],
        super_admin: getIsSuperAdmin(),
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
        isLoading: updateUser.action.isPending,
        isDisabled: !updateData().changed,
        errors: updateUser.errors(),
      }}
      content={{
        title: T("update_user_panel_title"),
        description: T("update_user_panel_description"),
        submit: T("update"),
      }}
    >
      {() => (
        <>
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
            errors={updateUser.errors()?.errors?.body?.role_ids}
          />
          <Show when={userStore.get.user?.super_admin}>
            <Form.Checkbox
              id="super_admin"
              value={getIsSuperAdmin()}
              onChange={setIsSuperAdmin}
              name={"super_admin"}
              copy={{
                label: T("is_super_admin"),
              }}
              errors={updateUser.errors()?.errors?.body?.super_admin}
            />
          </Show>
        </>
      )}
    </Panel.Root>
  );
};

export default UpdateUserPanel;
