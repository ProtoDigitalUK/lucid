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

interface SelectFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage?: number;
	};
}

export const SelectField: Component<SelectFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<string | number | null>(null);

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const value = fieldData()?.value as string | undefined;
		setValue(value || null);
	});

	// -------------------------------
	// Render
	return (
		<Form.Select
			id={`field-${props.state.fieldConfig.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue() || undefined}
			options={props.state.fieldConfig.options || []}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: value || null,
					});
					setValue(value || null);
				});
			}}
			name={props.state.fieldConfig.key}
			copy={{
				label: props.state.fieldConfig.title,
				describedBy: props.state.fieldConfig.description,
			}}
			noClear={props.state.fieldConfig.validation?.required || false}
			// errors={props.state.fieldError}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
