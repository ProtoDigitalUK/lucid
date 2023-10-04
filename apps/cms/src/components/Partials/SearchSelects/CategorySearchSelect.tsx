import { Component, createSignal } from "solid-js";
// Services
import api from "@/services/api";
// Stores
import { environment } from "@/store/environmentStore";
// Types
import type { ValueT, SelectProps } from "@/components/Groups/Form/Select";
// Components
import Form from "@/components/Groups/Form";

interface CategorySearchSelectProps {
  value: ValueT;
  setValue: (_value: ValueT) => void;
  collectionKey: string;
  name: string;
  id: string;
  copy?: SelectProps["copy"];
}

const CategorySearchSelect: Component<CategorySearchSelectProps> = (props) => {
  const [getSearchQuery, setSearchQuery] = createSignal<string>("");

  // ----------------------------------
  // Queries
  const categories = api.environment.collections.categories.useGetMultiple({
    queryParams: {
      filters: {
        collection_key: props.collectionKey,
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
        isLoading: categories.isLoading,
      }}
      options={
        categories.data?.data.map((cat) => ({
          value: cat.id,
          label: cat.title,
        })) || []
      }
    />
  );
};

export default CategorySearchSelect;