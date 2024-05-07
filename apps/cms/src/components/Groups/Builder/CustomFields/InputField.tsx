import {
	type Component,
	createSignal,
	batch,
	createMemo,
	createEffect,
} from "solid-js";
import type { CustomField, FieldResponse } from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import Form from "@/components/Groups/Form";

interface InputFieldProps {
	type: "number" | "text" | "datetime-local";
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage?: number;
	};
}

export const InputField: Component<InputFieldProps> = (props) => {
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
		switch (props.type) {
			case "number": {
				const value = fieldData()?.value as number | undefined;
				setValue(typeof value !== "number" ? "" : value.toString());
				break;
			}
			default: {
				const value = (fieldData()?.value as string | undefined) || "";
				setValue(value);
				break;
			}
		}
	});

	// -------------------------------
	// Render
	return (
		<Form.Input
			id={`field-${props.state.fieldConfig.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue()}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: props.type === "number" ? Number(value) : value,
					});
					setValue(value);
				});
			}}
			name={props.state.fieldConfig.key}
			type={props.type}
			copy={{
				label: props.state.fieldConfig.title,
				placeholder: props.state.fieldConfig.placeholder,
				describedBy: props.state.fieldConfig.description,
			}}
			// errors={props.state.fieldError}
			disabled={props.state.fieldConfig.disabled}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
