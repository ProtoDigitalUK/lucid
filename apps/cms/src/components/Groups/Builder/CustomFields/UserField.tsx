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

interface UserFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage?: number;
	};
}

export const UserField: Component<UserFieldProps> = (props) => {
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
		const value = fieldData()?.value as number | undefined;
		setValue(typeof value !== "number" ? "" : value.toString());
	});

	// -------------------------------
	// Render
	return (
		// TODO: update to user user select modal or select field
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
						value: Number(value),
					});
					setValue(value);
				});
			}}
			name={props.state.fieldConfig.key}
			type={"text"}
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