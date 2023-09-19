import { Component, createSignal } from "solid-js";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
// Types
import type { ValueT, SelectProps } from "@/components/Groups/Form/Select";
import type { ErrorResult } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

interface ValidParentPageSearchSelectProps {
  pageId: number;
  value: ValueT;
  setValue: (_value: ValueT) => void;
  collectionKey: string;
  name: string;
  id: string;
  copy?: SelectProps["copy"];
  errors?: ErrorResult;
}

const ValidParentPageSearchSelect: Component<
  ValidParentPageSearchSelectProps
> = (props) => {
  const [getSearchQuery, setSearchQuery] = createSignal<string>("");

  // ----------------------------------
  // Queries
  const validParents = api.environment.collections.pages.useGetValidParents({
    queryParams: {
      location: {
        id: props?.pageId,
      },
      filters: {
        collection_key: props.collectionKey,
        title: getSearchQuery,
      },
      headers: {
        "lucid-environment": environment,
      },
      perPage: 10,
    },
  });

  // ----------------------------------
  // Render
  return (
    <Form.Select
      id={props.id}
      value={props.value}
      onChange={props.setValue}
      copy={props.copy}
      name={props.name}
      search={{
        value: getSearchQuery(),
        onChange: setSearchQuery,
        isLoading: validParents.isLoading,
      }}
      options={
        validParents.data?.data.map((page) => ({
          value: page.id,
          label: page.title,
        })) || []
      }
      errors={props.errors}
    />
  );
};

export default ValidParentPageSearchSelect;
