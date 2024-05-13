import {
	type Component,
	createSignal,
	batch,
	createMemo,
	createEffect,
} from "solid-js";
import type {
	CustomField,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface InputFieldProps {
	type: "number" | "text" | "datetime-local";
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage: string;
		fieldError: FieldErrors | undefined;
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
		const value = brickHelpers.getFieldValue<string | number>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLanguage: props.state.contentLanguage,
		});

		switch (props.type) {
			case "number": {
				setValue(typeof value !== "number" ? "" : value.toString());
				break;
			}
			default: {
				setValue(typeof value !== "string" ? "" : value);
				break;
			}
		}
	});

	// -------------------------------
	// Render
	return (
		<Form.Input
			id={brickHelpers.customFieldId({
				key: props.state.fieldConfig.key,
				brickIndex: props.state.brickIndex,
				groupId: props.state.groupId,
			})}
			value={getValue()}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldConfig: props.state.fieldConfig,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: props.type === "number" ? Number(value) : value,
						contentLanguage: props.state.contentLanguage,
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
			errors={props.state.fieldError}
			disabled={props.state.fieldConfig.disabled}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
