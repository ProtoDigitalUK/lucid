import {
	type Component,
	type Accessor,
	createSignal,
	createEffect,
} from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface JSONFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const JSONField: Component<JSONFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

	// -------------------------------
	// Effects
	createEffect(() => {
		const field = brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			field: props.state.field,
			contentLanguage: props.state.contentLanguage,
		});
		const value = (field?.value as string | undefined) || "";
		setValue(JSON.stringify(value, null, 4));
	});

	// -------------------------------
	// Render
	return (
		<Form.JSONTextarea
			id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue()}
			onChange={(value) =>
				brickStore.get.setFieldValue({
					brickIndex: props.state.brickIndex,
					fieldPath: props.state.getFieldPath(),
					groupPath: props.state.getGroupPath(),
					value: JSON.parse(value),
				})
			}
			name={props.state.field.key}
			copy={{
				label: props.state.field.title,
				placeholder: props.state.field.placeholder,
				describedBy: props.state.field.description,
			}}
			// errors={props.state.fieldError}
			required={props.state.field.validation?.required || false}
			theme={"basic"}
		/>
	);
};
