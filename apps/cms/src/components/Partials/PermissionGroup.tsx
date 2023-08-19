import { Component } from "solid-js";

interface PermissionGroupProps {
  title: string;
  options: Array<{
    title: string;
    permissions: Array<string>;
  }>;
  environment?: string;

  selectedPermissions: Array<{
    environment?: string;
    permission: string;
  }>;
  setSelectedPermissions: (
    _state: Array<{
      environment: string | null;
      permission: string;
    }>
  ) => void;
}

const PermissionGroup: Component<PermissionGroupProps> = (props) => {
  // ---------------------------------
  // Render
  return (
    <div>
      <h3>{props.title}</h3>
    </div>
  );
};

export default PermissionGroup;
