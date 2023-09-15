import T from "@/translations";
import { Component } from "solid-js";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
// Types
import { TableRowProps } from "@/types/components";
import {
  CollectionPagesResT,
  CollectionResT,
} from "@lucid/types/src/collections";
// Stores
import userStore from "@/store/userStore";
// Components
import Table from "@/components/Groups/Table";
import PageTitleCol from "@/components/Tables/Columns/PageTitleCol";
import DateCol from "@/components/Tables/Columns/DateCol";
import PillCol from "../Columns/PillCol";

interface PageRowProps extends TableRowProps {
  page: CollectionPagesResT;
  collection: CollectionResT;
  environmentKey: string;
  include: boolean[];
  rowTarget: ReturnType<typeof useRowTarget<"delete">>;
}

const PageRow: Component<PageRowProps> = (props) => {
  // ----------------------------------
  // Render
  return (
    <Table.Tr
      index={props.index}
      selected={props.selected}
      options={props.options}
      callbacks={props.callbacks}
      actions={[
        {
          label: T("edit"),
          type: "link",
          href: `/env/${props.environmentKey}/collection/${props.collection.key}/${props.page.id}`,
          permission: userStore.get.hasEnvPermission(
            ["update_content"],
            props.environmentKey
          ).all,
        },
        {
          label: T("delete"),
          type: "button",
          onClick: () => {
            props.rowTarget.setTargetId(props.page.id);
            props.rowTarget.setTrigger("delete", true);
          },
          permission: userStore.get.hasEnvPermission(
            ["delete_content"],
            props.environmentKey
          ).all,
        },
      ]}
    >
      <PageTitleCol
        title={props.page.title}
        fullSlug={props.page.full_slug}
        options={{ include: props?.include[0] }}
      />
      <PillCol
        theme={props.page.published ? "secondary" : "warning"}
        text={props.page.published ? T("published") : T("draft")}
        options={{ include: props?.include[1] }}
      />
      <DateCol
        date={props.page.created_at}
        options={{ include: props?.include[2] }}
      />
      <DateCol
        date={props.page.updated_at}
        options={{ include: props?.include[3] }}
      />
    </Table.Tr>
  );
};

export default PageRow;
