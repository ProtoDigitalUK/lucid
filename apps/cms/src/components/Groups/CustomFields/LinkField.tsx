import { type Component, createSignal, createEffect } from "solid-js";
// Types
import type { FieldErrors, CustomField, LinkValue } from "@lucidcms/core/types";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Store
import builderStore, { type BrickStoreFieldT } from "@/store/builderStore";
// Components
import Form from "@/components/Groups/Form";

interface LinkFieldProps {
	state: {
		brickIndex: number;
		key: CustomField["key"];
		field: CustomField;
		groupId?: BrickStoreFieldT["group_id"];

		fieldError: FieldErrors | undefined;
		contentLanguage?: number | undefined;
	};
}

export const LinkField: Component<LinkFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<LinkValue | undefined | null>();

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
		const value = field?.value as LinkValue | undefined | null;
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
