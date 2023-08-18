import { Component, createMemo } from "solid-js";
// Utils
import dateHelpers from "@/utils/date-helpers";
// Components
import Table from "@/components/Groups/Table";

interface TextColProps {
  date?: string | null;
  options?: {
    include?: boolean;
  };
}

const DateCol: Component<TextColProps> = (props) => {
  // ----------------------------------
  // Memos
  const date = createMemo(() => {
    if (!props.date) return null;
    return dateHelpers.formatDate(props.date);
  });

  // ----------------------------------
  // Render
  return (
    <Table.Td
      options={{
        include: props?.options?.include,
      }}
    >
      {date() || "~"}
    </Table.Td>
  );
};

export default DateCol;
