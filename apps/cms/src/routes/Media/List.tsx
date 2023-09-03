import T from "@/translations";
import { Component } from "solid-js";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import MediaGrid from "@/components/Grids/MediaGrid";

const MediaListRoute: Component = () => {
  // ----------------------------------
  // Hooks & State
  const searchParams = useSearchParams(
    {
      filters: {
        name: {
          value: "",
          type: "text",
        },
        file_extension: {
          value: "",
          type: "text",
        },
      },
      sorts: {
        created_at: undefined,
        updated_at: "desc",
        name: undefined,
        file_size: undefined,
        width: undefined,
        height: undefined,
        mime_type: undefined,
        file_extension: undefined,
      },
    },
    {
      singleSort: true,
    }
  );

  // ----------------------------------
  // Render
  return (
    <Layout.PageLayout
      title={T("media_route_title")}
      description={T("media_route_description")}
      headingChildren={
        <Query.Row
          searchParams={searchParams}
          filters={[
            {
              label: T("name"),
              key: "name",
              type: "text",
            },
            {
              label: T("file_extension"),
              key: "file_extension",
              type: "text",
            },
          ]}
          sorts={[
            {
              label: T("created_at"),
              key: "created_at",
            },
            {
              label: T("updated_at"),
              key: "updated_at",
            },
            {
              label: T("name"),
              key: "name",
            },
            {
              label: T("file_size"),
              key: "file_size",
            },
            {
              label: T("width"),
              key: "width",
            },
            {
              label: T("height"),
              key: "height",
            },
            {
              label: T("mime_type"),
              key: "mime_type",
            },
            {
              label: T("file_extension"),
              key: "file_extension",
            },
          ]}
          perPage={[]}
        />
      }
    >
      <MediaGrid searchParams={searchParams} />
    </Layout.PageLayout>
  );
};

export default MediaListRoute;
