import T from "@/translations";
import {
  Component,
  For,
  createEffect,
  createMemo,
  createSignal,
  Show,
} from "solid-js";
// Services
import api from "@/services/api";
// Components
import Panel from "@/components/Groups/Panel";
import PermissionGroup, {
  SelectedPermissions,
} from "@/components/Partials/PermissionGroup";
import SectionHeading from "@/components/Blocks/SectionHeading";
import Form from "@/components/Groups/Form";
import InputGrid from "@/components/Containers/InputGrid";

interface UpsertRolePanelProps {
  id?: number;
  open: boolean;
  setOpen: (_state: boolean) => void;
}

const UpsertRolePanel: Component<UpsertRolePanelProps> = (props) => {
  // ---------------------------------
  // State
  const [initialValuesSet, setInitialValuesSet] = createSignal<boolean>(false);
  const [selectedPermissions, setSelectedPermissions] = createSignal<
    SelectedPermissions[]
  >([]);
  const [getName, setName] = createSignal("");

  // ---------------------------------
  // Query
  const role = api.roles.useGetSingle({
    queryParams: {
      location: {
        role_id: props.id as number,
      },
    },
    enabled: () => props.open && props.id !== undefined,
  });
  const permissions = api.permissions.useGetAll({
    queryParams: {},
  });
  const environments = api.environment.useGetAll({
    queryParams: {},
  });

  // ---------------------------------
  // Effects
  createEffect(() => {
    if (!initialValuesSet() && !role.isLoading && !role.isError) {
      if (role.data?.data.permissions) {
        setSelectedPermissions(
          role.data?.data.permissions.map((permission) => {
            return {
              environment: permission.environment_key,
              permission: permission.permission,
            };
          })
        );
      }
      setInitialValuesSet(true);
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

  // ---------------------------------
  // Return
  return (
    <Panel.Root
      open={props.open}
      setOpen={props.setOpen}
      onSubmit={() => {}}
      fetchState={{
        isLoading: isLoading(),
        isError: isError(),
      }}
      content={{
        title: panelTitle(),
        description: panelDescription(),
        submit: panelSubmit(),
      }}
    >
      {/* Details */}
      <Show when={!props.id}>
        <SectionHeading title={T("details")} />
        <InputGrid columns={2}>
          <Form.Input
            id="key"
            name="key"
            type="text"
            value={getName()}
            onChange={setName}
            copy={{
              label: T("name"),
            }}
            required={true}
            // errors={errors()?.errors?.body?.key}
            noMargin={true}
          />
        </InputGrid>
      </Show>

      <PermissionGroup
        title={T("global_permissions")}
        options={permissions.data?.data.global || []}
        selectedPermissions={selectedPermissions()}
        setSelectedPermissions={setSelectedPermissions}
        toggleMultiplePermissions={toggleMultiplePermissions}
        environment={null}
      />
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
