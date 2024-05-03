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

interface CheckboxFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const CheckboxField: Component<CheckboxFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal(0);

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

		const value = field?.value as 1 | 0 | undefined;
		setValue(value || 0);
	});

	// -------------------------------
	// Render
	return (
		<Form.Switch
			id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue() === 1}
			onChange={(value) => {
				brickStore.get.setFieldValue({
					brickIndex: props.state.brickIndex,
					fieldPath: props.state.getFieldPath(),
					groupPath: props.state.getGroupPath(),
					value: value ? 1 : 0,
				});
			}}
			name={props.state.field.key}
			copy={{
				label: props.state.field.title,
				describedBy: props.state.field.description,
				true: props.state.field?.copy?.true,
				false: props.state.field?.copy?.false,
			}}
			// errors={props.state.fieldError}
			required={props.state.field.validation?.required || false}
			theme={"basic"}
		/>
	);
};
