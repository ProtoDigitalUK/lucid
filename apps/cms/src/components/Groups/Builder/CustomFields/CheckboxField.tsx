import {
	type Component,
	createSignal,
	createMemo,
	batch,
	createEffect,
} from "solid-js";
import type { CustomField, FieldResponse } from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import Form from "@/components/Groups/Form";

interface CheckboxFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage?: number;
	};
}

export const CheckboxField: Component<CheckboxFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal(0);

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const value = fieldData()?.value as 1 | 0 | undefined;
		setValue(value || 0);
	});

	// -------------------------------
	// Render
	return (
		<Form.Switch
			id={`field-${props.state.fieldConfig.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue() === 1}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: value ? 1 : 0,
					});
					setValue(value ? 1 : 0);
				});
			}}
			name={props.state.fieldConfig.key}
			copy={{
				label: props.state.fieldConfig.title,
				describedBy: props.state.fieldConfig.description,
				true: props.state.fieldConfig?.copy?.true,
				false: props.state.fieldConfig?.copy?.false,
			}}
			disabled={props.state.fieldConfig.disabled}
			// errors={props.state.fieldError}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
