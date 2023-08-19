import T from "@/translations";
import { Component } from "solid-js";
// Services
import api from "@/services/api";
// Components
import Panel from "@/components/Groups/Panel";

interface UpdateRoleProps {
  id: number;
  open: boolean;
  setOpen: (_state: boolean) => void;
}

const UpdateRole: Component<UpdateRoleProps> = (props) => {
  // ---------------------------------
  // Query
  const role = api.roles.useGetSingle({
    queryParams: {
      location: {
        role_id: props.id,
      },
    },
    enabled: () => props.open,
  });
  const permissions = api.permissions.useGetAll({
    queryParams: {},
  });

  // ---------------------------------
  // Return
  return (
    <Panel.Root
      state={{
        open: props.open,
        setOpen: props.setOpen,
        isLoading: role.isLoading,
        isError: role.isError,
      }}
      content={{
        title: T("update_role_panel_title", {
          name: role.data?.data.name || "",
        }),
        description: T("update_role_panel_description", {
          name: role.data?.data.name || "",
        }),
      }}
      footer={<>footer</>}
    >
      hello
    </Panel.Root>
  );
};

export default UpdateRole;
