import T from "@/translations";
import { Component, Accessor, createMemo } from "solid-js";
// Services
import api from "@/services/api";
// Components
import Panel from "@/components/Groups/Panel";

interface UpdateUserPanelProps {
  id: Accessor<number | undefined>;
  state: {
    open: boolean;
    setOpen: (_state: boolean) => void;
  };
}

const UpdateUserPanel: Component<UpdateUserPanelProps> = (props) => {
  // ---------------------------------
  // Queries
  const roles = api.roles.useGetMultiple({
    queryParams: {
      includes: {
        permissions: false,
      },
      perPage: -1,
    },
  });
  const user = api.users.useGetSingle({
    queryParams: {
      location: {
        user_id: props.id,
      },
    },
  });

  // ---------------------------------
  // Memos
  const isLoading = createMemo(() => {
    return user.isLoading || roles.isLoading;
  });

  const isError = createMemo(() => {
    return user.isError || roles.isError;
  });

  // ---------------------------------
  // Render
  return (
    <Panel.Root
      open={props.state.open}
      setOpen={props.state.setOpen}
      onSubmit={() => {
        alert("submit");
      }}
      reset={() => {
        // updateUser.reset();
      }}
      fetchState={{
        isLoading: isLoading(),
        isError: isError(),
      }}
      // mutateState={{
      //   isLoading: isCreating(),
      //   isDisabled: submitIsDisabled(),
      //   errors: errors(),
      // }}
      content={{
        title: T("update_user_panel_title"),
        description: T("update_user_panel_description"),
        submit: T("update"),
      }}
    >
      hello
    </Panel.Root>
  );
};

export default UpdateUserPanel;
