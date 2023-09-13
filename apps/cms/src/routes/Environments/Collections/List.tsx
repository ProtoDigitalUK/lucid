import T from "@/translations";
import { useParams } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
// Services
import api from "@/services/api";
// Store
import userStore from "@/store/userStore";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";

const EnvCollectionsListRoute: Component = () => {
  // ----------------------------------
  // State & Hooks
  const props = useParams();
  const searchParams = useSearchParams(
    {
      filters: {
        title: {
          value: "",
          type: "text",
        },
        slug: {
          value: "",
          type: "text",
        },
        category_id: {
          value: [],
          type: "array",
        },
      },
      sorts: {
        created_at: undefined,
      },
    },
    {
      singleSort: true,
    }
  );
  const [getOpenCreatePanel, setOpenCreatePanel] = createSignal(false);

  // ----------------------------------
  // Queries
  const collection = api.environment.collections.useGetSingle({
    queryParams: {
      location: {
        collection_key: props.collectionKey,
      },
    },
    enabled: () => !!props.collectionKey,
  });

  // ----------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={collection.data?.data.title}
      description={collection.data?.data.description || ""}
      options={{
        noBorder: true,
      }}
      state={{
        isLoading: collection.isLoading,
        isError: collection.isError,
        isSuccess: collection.isSuccess,
      }}
      actions={{
        create: {
          open: getOpenCreatePanel(),
          setOpen: setOpenCreatePanel,
          permission: userStore.get.hasEnvPermission(
            ["create_content"],
            props.envKey
          ).all,
        },
      }}
      headingChildren={
        <Query.Row
          searchParams={searchParams}
          filters={[
            {
              label: T("title"),
              key: "title",
              type: "text",
            },
            {
              label: T("slug"),
              key: "slug",
              type: "text",
            },
            {
              label: T("category"),
              key: "category_id",
              type: "multi-select",
            },
          ]}
          sorts={[
            {
              label: T("created_at"),
              key: "created_at",
            },
          ]}
          perPage={[]}
        />
      }
    >
      hello
    </Layout.PageLayout>
  );
};

export default EnvCollectionsListRoute;
