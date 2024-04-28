import { type Component, createMemo } from "solid-js";
import dateHelpers from "@/utils/date-helpers";
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
	const fullDate = createMemo(() => {
		if (!props.date) return null;
		return dateHelpers.formatFullDate(props.date);
	});

	// ----------------------------------
	// Render
	return (
		<Table.Td
			options={{
				include: props?.options?.include,
			}}
		>
			<span class="whitespace-nowrap" title={fullDate() || ""}>
				{date() || "-"}
			</span>
		</Table.Td>
	);
};

export default DateCol;
