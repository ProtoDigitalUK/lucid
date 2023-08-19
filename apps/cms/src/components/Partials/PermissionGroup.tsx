import T from "@/translations";
import { Component, For, createMemo } from "solid-js";
// Types
import { PermissionGroup as PermissionGroupT } from "@lucid/types/src/permissions";
// Components
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";

export interface SelectedPermissions {
  environment: string | null;
  permission: string;
}

interface PermissionGroupProps {
  title: string;
  options: PermissionGroupT[];
  environment: string | null;

  selectedPermissions: Array<SelectedPermissions>;
  setSelectedPermissions: (_permissions: SelectedPermissions[]) => void;
  toggleMultiplePermissions: (_permissions: SelectedPermissions[]) => void;
}

const PermissionGroup: Component<PermissionGroupProps> = (props) => {
  // ---------------------------------
  // Memos
  const groupAllSelected = createMemo(() => {
    const selectedPermissions = props.selectedPermissions.filter(
      (selectedPermission) =>
        selectedPermission.environment === props.environment
    );
    const totalOptionPerms = props.options.reduce((acc, option) => {
      return acc + option.permissions.length;
    }, 0);

    if (selectedPermissions.length === totalOptionPerms) {
      return true;
    }
    return false;
  });

  // ---------------------------------
  // Functions
  const selectGroupPermissions = () => {
    const newSelectedPermissions = props.selectedPermissions.filter(
      (selectedPermission) =>
        selectedPermission.environment !== props.environment
    );

    for (let i = 0; i < props.options.length; i++) {
      for (let j = 0; j < props.options[i].permissions.length; j++) {
        newSelectedPermissions.push({
          environment: props.environment,
          permission: props.options[i].permissions[j],
        });
      }
    }

    props.setSelectedPermissions(newSelectedPermissions);
  };
  const deselectGroupPermissions = () => {
    const newSelectedPermissions = props.selectedPermissions.filter(
      (selectedPermission) =>
        selectedPermission.environment !== props.environment
    );

    props.setSelectedPermissions(newSelectedPermissions);
  };

  // ---------------------------------
  // Render
  return (
    <div class="w-full mb-30 last:mb-0">
      <SectionHeading title={props.title} headingType="h3">
        <div>
          <Form.Checkbox
            value={groupAllSelected()}
            onChange={(value) => {
              if (value) {
                selectGroupPermissions();
              } else {
                deselectGroupPermissions();
              }
            }}
            copy={{}}
            noMargin={true}
          />
        </div>
      </SectionHeading>
      <div class="w-full">
        <For each={props.options}>
          {(option) => (
            <div class="mb-15 last:mb-0">
              <h4>{T(option.key)}</h4>
              <div class="mt-2.5 bg-backgroundAccent p-15 rounded-md grid grid-cols-2 gap-x-15 gap-y-2.5">
                <For each={option.permissions}>
                  {(permission) => (
                    <Form.Checkbox
                      value={props.selectedPermissions.some(
                        (selectedPermission) =>
                          selectedPermission.permission === permission &&
                          selectedPermission.environment === props.environment
                      )}
                      onChange={() =>
                        props.toggleMultiplePermissions([
                          {
                            environment: props.environment,
                            permission,
                          },
                        ])
                      }
                      copy={{
                        label: T(`permissions_${permission}`),
                      }}
                      noMargin={true}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default PermissionGroup;
