import {
	type Component,
	type Accessor,
	createSignal,
	onMount,
	batch,
} from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface ColourFieldProps {
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const ColourField: Component<ColourFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

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

		const value = (field?.value as string | undefined) || "";
		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		<div>
			<Form.Colour
				id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
				value={getValue()}
				onChange={(value) => {
					batch(() => {
						brickStore.get.setFieldValue({
							brickIndex: props.state.brickIndex,
							fieldPath: props.state.getFieldPath(),
							groupPath: props.state.getGroupPath(),
							value: value,
						});
						setValue(value);
					});
				}}
				name={props.state.field.key}
				copy={{
					label: props.state.field.title,
					describedBy: props.state.field.description,
				}}
				presets={props.state.field.presets}
				// errors={props.state.fieldError}
				required={props.state.field.validation?.required || false}
			/>
		</div>
	);
};
