import {
	type Component,
	type Accessor,
	createSignal,
	batch,
	createMemo,
	createEffect,
} from "solid-js";
import type { CustomField } from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface InputFieldProps {
	type: "number" | "text" | "datetime-local";
	state: {
		brickIndex: number;
		field: CustomField;
		groupId?: number | string;
		contentLanguage?: number;

		getFieldPath: Accessor<string[]>;
		getGroupPath: Accessor<Array<string | number>>;
	};
}

export const InputField: Component<InputFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		console.log("fieldData");
		return brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupPath: props.state.getGroupPath(),
			field: props.state.field,
			contentLanguage: props.state.contentLanguage,
		});
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const field = fieldData();

		switch (props.type) {
			case "number": {
				const value = field?.value as number | undefined;
				setValue(typeof value !== "number" ? "" : value.toString());
				break;
			}
			default: {
				const value = (field?.value as string | undefined) || "";
				setValue(value);
				break;
			}
		}
	});

	// -------------------------------
	// Render
	return (
		<Form.Input
			id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupId}`}
			value={getValue()}
			onChange={(value) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldPath: props.state.getFieldPath(),
						groupPath: props.state.getGroupPath(),
						value: props.type === "number" ? Number(value) : value,
					});
					setValue(value);
				});
			}}
			name={props.state.field.key}
			type={props.type}
			copy={{
				label: props.state.field.title,
				placeholder: props.state.field.placeholder,
				describedBy: props.state.field.description,
			}}
			// errors={props.state.fieldError}
			required={props.state.field.validation?.required || false}
			theme={"basic"}
		/>
	);
};
