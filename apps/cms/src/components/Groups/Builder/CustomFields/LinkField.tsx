import {
	type Component,
	createSignal,
	createMemo,
	batch,
	createEffect,
} from "solid-js";
import type {
	CustomField,
	LinkValue,
	FieldResponse,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import Form from "@/components/Groups/Form";

interface LinkFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage?: number;
	};
}

export const LinkField: Component<LinkFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<LinkValue | undefined | null>();

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const value = fieldData()?.value as LinkValue | undefined | null;
		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		<>
			<Form.LinkSelect
				id={`field-${props.state.fieldConfig.key}-${props.state.brickIndex}-${props.state.groupId}`}
				type={"link"}
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
				meta={null}
				copy={{
					label: props.state.fieldConfig.title,
					describedBy: props.state.fieldConfig.description,
				}}
				// errors={props.state.fieldError}
				required={props.state.fieldConfig.validation?.required || false}
			/>
		</>
	);
};
