import {
	type Component,
	createSignal,
	batch,
	createMemo,
	createEffect,
} from "solid-js";
import type {
	CFConfig,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import helpers from "@/utils/helpers";
import Form from "@/components/Groups/Form";

interface InputFieldProps {
	type: "number" | "text" | "datetime-local";
	state: {
		brickIndex: number;
		fieldConfig: CFConfig<"text" | "number" | "datetime">;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLocale: string;
		fieldError: FieldErrors | undefined;
		altLocaleHasError: boolean;
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
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue<string | number>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLocale: props.state.contentLocale,
		});
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const value = fieldValue();
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
						contentLocale: props.state.contentLocale,
					});
					setValue(value);
				});
			}}
			name={props.state.fieldConfig.key}
			type={props.type}
			copy={{
				label: helpers.getLocaleValue({
					value: props.state.fieldConfig.labels.title,
					locale: props.state.contentLocale,
				}),
				describedBy: helpers.getLocaleValue({
					value: props.state.fieldConfig.labels.description,
					locale: props.state.contentLocale,
				}),
				placeholder: helpers.getLocaleValue({
					value: props.state.fieldConfig.labels.placeholder,
					locale: props.state.contentLocale,
				}),
			}}
			errors={props.state.fieldError}
			altLocaleHasError={props.state.altLocaleHasError}
			disabled={props.state.fieldConfig.disabled}
			required={props.state.fieldConfig.validation?.required || false}
			theme={"basic"}
		/>
	);
};
