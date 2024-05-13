import {
	type Component,
	type Accessor,
	createSignal,
	createEffect,
	createMemo,
	batch,
} from "solid-js";
import type {
	CustomField,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface JSONFieldProps {
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

export const JSONField: Component<JSONFieldProps> = (props) => {
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
		const value = brickHelpers.getFieldValue<string>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLanguage: props.state.contentLanguage,
		});

		setValue(JSON.stringify(value ?? "", null, 4));
	});

	// -------------------------------
	// Render
	return (
		<Form.JSONTextarea
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
						value: JSON.parse(value),
						contentLanguage: props.state.contentLanguage,
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
			errors={props.state.fieldError}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
