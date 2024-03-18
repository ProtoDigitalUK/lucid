import { Component, createSignal, createEffect } from "solid-js";
// Types
import type { FieldError } from "@/types/api";
import type { CustomFieldT, LinkValueT } from "@headless/types/src/bricks";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Components
import Form from "@/components/Groups/Form";

interface LinkFieldProps {
	state: {
		brickIndex: number;
		key: CustomFieldT["key"];
		field: CustomFieldT;
		groupId?: BrickStoreFieldT["group_id"];

		fieldError: FieldError | undefined;
		contentLanguage?: number | undefined;
	};
}

export const LinkField: Component<LinkFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<LinkValueT | undefined | null>();

	// -------------------------------
	// Effects
	createEffect(() => {
		const field = brickHelpers.getField({
			brickIndex: props.state.brickIndex,
			field: props.state.field,
			groupId: props.state.groupId,
			key: props.state.key,
			contentLanguage: props.state.contentLanguage,
		});
		const value = field?.value as LinkValueT | undefined | null;
		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		<>
			<Form.LinkSelect
				id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
				type={"link"}
				value={getValue()}
				onChange={(value) =>
					builderStore.get.updateFieldValue({
						brickIndex: props.state.brickIndex,
						key: props.state.key,
						groupId: props.state.groupId,
						contentLanguage: props.state.contentLanguage,
						value: value,
					})
				}
				meta={null}
				copy={{
					label: props.state.field.title,
					describedBy: props.state.field.description,
				}}
				errors={props.state.fieldError}
				required={props.state.field.validation?.required || false}
			/>
		</>
	);
};
