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

interface TextareaFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage?: number;
	};
}

export const TextareaField: Component<TextareaFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const value = (fieldData()?.value as string | undefined) || "";
		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		<Form.Textarea
			id={`field-${props.state.fieldConfig.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue()}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: value,
					});
					setValue(value);
				});
			}}
			name={props.state.fieldConfig.key}
			copy={{
				label: props.state.fieldConfig.title,
				placeholder: props.state.fieldConfig.placeholder,
				describedBy: props.state.fieldConfig.description,
			}}
			disabled={props.state.fieldConfig.disabled}
			// errors={props.state.fieldError}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
