import T from "@/translations";
import {
  Accessor,
  Component,
  For,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
// Services
import api from "@/services/api";
// Utils
import helpers from "@/utils/helpers";
// Components
import Panel from "@/components/Groups/Panel";
import PermissionGroup, {
  SelectedPermissions,
} from "@/components/Partials/PermissionGroup";
import SectionHeading from "@/components/Blocks/SectionHeading";
import Form from "@/components/Groups/Form";
import InputGrid from "@/components/Containers/InputGrid";

interface UpsertRolePanelProps {
  id?: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const UpsertRolePanel: Component<UpsertRolePanelProps> = (props) => {
  // ---------------------------------
  // State
  const [selectedPermissions, setSelectedPermissions] = createSignal<
    SelectedPermissions[]
  >([]);
  const [getName, setName] = createSignal("");

  // ---------------------------------
  // Query
  const role = api.roles.useGetSingle({
    queryParams: {
      location: {
        role_id: props.id as Accessor<number | undefined>,
      },
    },
    key: () => props.state.open,
    enabled: () => props.state.open && props.id !== undefined,
  });
  const permissions = api.permissions.useGetAll({
    queryParams: {},
  });
  const environments = api.environment.useGetAll({
    queryParams: {},
  });

  // ----------------------------------------
  // Mutations
  const createRole = api.roles.useCreateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });
  const updateRole = api.roles.useUpdateSingle({
    onSuccess: () => {
      props.state.setOpen(false);
    },
  });

  // ---------------------------------
  // Functions
  const toggleMultiplePermissions = (permissions: SelectedPermissions[]) => {
    const newSelectedPermissions = selectedPermissions();

    for (let i = 0; i < permissions.length; i++) {
      const permissionIndex = newSelectedPermissions.findIndex(
        (selectedPermission) =>
          selectedPermission.permission === permissions[i].permission &&
          selectedPermission.environment === permissions[i].environment
      );
      if (permissionIndex !== -1) {
        newSelectedPermissions.splice(permissionIndex, 1);
      } else {
        newSelectedPermissions.push(permissions[i]);
      }
    }

    setSelectedPermissions([...newSelectedPermissions]);
  };
  const resPermsToSelectedFormat = () => {
    if (role.data?.data.permissions) {
      return role.data?.data.permissions.map((permission) => {
        return {
          environment: permission.environment_key,
          permission: permission.permission,
        };
      });
    }
    return [];
  };

  const buildPermissionsArr = (permissions: SelectedPermissions[]) => {
    const permArr: Array<{
      environment_key?: string;
      permissions: string[];
    }> = [];

    const globalPerms = permissions.filter(
      (selectedPermission) => selectedPermission.environment === null
    );
    if (globalPerms.length > 0) {
      permArr.push({
        permissions: globalPerms.map((perm) => perm.permission),
      });
    }

    if (environments.data?.data !== undefined) {
      for (let i = 0; i < environments.data?.data.length; i++) {
        const envPerms = permissions.filter(
          (selectedPermission) =>
            selectedPermission.environment === environments.data?.data[i].key
        );
        if (envPerms.length > 0) {
          permArr.push({
            environment_key: environments.data?.data[i].key,
            permissions: envPerms.map((perm) => perm.permission),
          });
        }
      }
    }

    return permArr;
  };

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (role.isSuccess) {
      setSelectedPermissions(resPermsToSelectedFormat());
      setName(role.data?.data.name || "");
    }
  });

  // ---------------------------------
  // Memos
  const isLoading = createMemo(() => {
    if (props.id === undefined)
      return permissions.isLoading || environments.isLoading;
    return role.isLoading || permissions.isLoading || environments.isLoading;
  });
  const isError = createMemo(() => {
    if (props.id === undefined)
      return permissions.isError || environments.isError;
    return role.isError || permissions.isError || environments.isError;
  });

  const panelTitle = createMemo(() => {
    if (props.id === undefined) return T("create_role_panel_title");
    return T("update_role_panel_title", {
      name: role.data?.data.name || "",
    });
  });
  const panelDescription = createMemo(() => {
    if (props.id === undefined) return T("create_role_panel_description");
    return T("update_role_panel_description", {
      name: role.data?.data.name || "",
    });
  });
  const panelSubmit = createMemo(() => {
    if (props.id === undefined) return T("create");
    return T("update");
  });

  const updateData = createMemo(() => {
    return helpers.updateData(
      {
        name: role.data?.data.name,
        permission_groups: buildPermissionsArr(resPermsToSelectedFormat()),
      },
      {
        name: getName(),
        permission_groups: buildPermissionsArr(selectedPermissions()),
      }
    );
  });
  const submitIsDisabled = createMemo(() => {
    if (!props.id) return false;
    return !updateData().changed;
  });

  // Mutation memos
  const isCreating = createMemo(() => {
    return createRole.action.isLoading || updateRole.action.isLoading;
  });
  const errors = createMemo(() => {
    if (!props.id) return createRole.errors();
    return updateRole.errors();
  });

  // ---------------------------------
  // Return
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        if (!props.id) {
          createRole.action.mutate({
            name: getName(),
            permission_groups: buildPermissionsArr(selectedPermissions()),
          });
        } else {
          updateRole.action.mutate({
            id: props.id() as number,
            body: updateData().data,
          });
        }
      }}
      reset={() => {
        setSelectedPermissions([]);
        setName("");
        createRole.reset();
        updateRole.reset();
      }}
      fetchState={{
        isLoading: isLoading(),
        isError: isError(),
      }}
      mutateState={{
        isLoading: isCreating(),
        isDisabled: submitIsDisabled(),
        errors: errors(),
      }}
      content={{
        title: panelTitle(),
        description: panelDescription(),
        submit: panelSubmit(),
      }}
    >
      {/* Details */}
      <SectionHeading title={T("details")} />
      <InputGrid columns={2}>
        <Form.Input
          id="name"
          name="name"
          type="text"
          value={getName()}
          onChange={setName}
          copy={{
            label: T("name"),
          }}
          required={true}
          errors={errors()?.errors?.body?.name}
          noMargin={true}
        />
      </InputGrid>
      {/* Global perms */}
      <PermissionGroup
        title={T("global_permissions")}
        options={permissions.data?.data.global || []}
        selectedPermissions={selectedPermissions()}
        setSelectedPermissions={setSelectedPermissions}
        toggleMultiplePermissions={toggleMultiplePermissions}
        environment={null}
      />
      {/* Env Perms */}
      <For each={environments.data?.data}>
        {(environment) => (
          <PermissionGroup
            title={environment.title}
            options={permissions.data?.data.environment || []}
            selectedPermissions={selectedPermissions()}
            setSelectedPermissions={setSelectedPermissions}
            toggleMultiplePermissions={toggleMultiplePermissions}
            environment={environment.key}
          />
        )}
      </For>
    </Panel.Root>
  );
};

export default UpsertRolePanel;
