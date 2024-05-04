import {
	type Component,
	type Accessor,
	createSignal,
	onMount,
	batch,
} from "solid-js";
import type { CustomField } from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface SelectFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const SelectField: Component<SelectFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<string | number | null>(null);

	// -------------------------------
	// Effects
	onMount(() => {
		const field = brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			field: props.state.field,
			contentLanguage: props.state.contentLanguage,
		});
		const value = field?.value as string | undefined;
		setValue(value || null);
	});

	// -------------------------------
	// Render
	return (
		<Form.Select
			id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue() || undefined}
			options={props.state.field.options || []}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldPath: props.state.getFieldPath(),
						groupPath: props.state.getGroupPath(),
						value: value || null,
					});
					setValue(value || null);
				});
			}}
			name={props.state.field.key}
			copy={{
				label: props.state.field.title,
				describedBy: props.state.field.description,
			}}
			noClear={props.state.field.validation?.required || false}
			// errors={props.state.fieldError}
			required={props.state.field.validation?.required || false}
			theme={"basic"}
		/>
	);
};
