import {
	type Component,
	type Accessor,
	createSignal,
	createEffect,
} from "solid-js";
import type { CustomField } from "@protoheadless/core/types";
import brickHelpers from "@/utils/brick-helpers";
import Form from "@/components/Groups/Form";

interface InputFieldProps {
	type: "number" | "text" | "datetime-local";
	state: {
		brickIndex: number;
		field: CustomField;
		groupIndex?: number;

		getFieldPath: Accessor<string[]>;
		getGroupIndexes: Accessor<number[]>;
	};
}

export const InputField: Component<InputFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

	// -------------------------------
	// Effects
	createEffect(() => {
		const field = brickHelpers.getBrickField({
			brickIndex: props.state.brickIndex,
			fieldPath: props.state.getFieldPath(),
			groupIndexes: props.state.getGroupIndexes(),
		});

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
			id={`field-${props.state.field.key}-${props.state.brickIndex}-${props.state.groupIndex}`}
			value={getValue()}
			onChange={
				(value) => {
					console.log(value);
				}
				// builderStore.get.updateFieldValue({
				// 	brickIndex: props.state.brickIndex,
				// 	key: props.state.key,
				// 	groupId: props.state.groupId,
				// 	contentLanguage: props.state.contentLanguage,
				// 	value: props.type === "number" ? Number(value) : value,
				// })
			}
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
