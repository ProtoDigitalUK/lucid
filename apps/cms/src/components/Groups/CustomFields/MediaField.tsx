import { Component, createSignal, createEffect } from "solid-js";
// Types
import type { CustomFieldT, MediaMetaT } from "@headless/types/src/bricks";
import type { FieldError } from "@/types/api";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Store
import builderStore, { BrickStoreFieldT } from "@/store/builderStore";
// Components
import Form from "@/components/Groups/Form";

interface MediaFieldProps {
	state: {
		brickIndex: number;
		key: CustomFieldT["key"];
		field: CustomFieldT;
		groupId?: BrickStoreFieldT["group_id"];

		fieldError: FieldError | undefined;
		contentLanguage?: number | undefined;
	};
}

export const MediaField: Component<MediaFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<number | undefined>();
	const [getMeta, setMeta] = createSignal<MediaMetaT | undefined>();

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
		const value = field?.value as number | undefined;
		const meta = field?.meta as MediaMetaT | undefined;
		setValue(value);
		setMeta(meta);
	});

	// -------------------------------
	// Render
	return (
		<>
			<Form.MediaSelect
				id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
				value={getValue()}
				meta={getMeta()}
				onChange={(value, meta) =>
					builderStore.get.updateFieldValue({
						brickIndex: props.state.brickIndex,
						key: props.state.key,
						groupId: props.state.groupId,
						contentLanguage: props.state.contentLanguage,
						value: value,
						meta: meta,
					})
				}
				copy={{
					label: props.state.field.title,
					describedBy: props.state.field.description,
				}}
				extensions={props.state.field.validation?.extensions}
				type={props.state.field.validation?.type}
				errors={props.state.fieldError}
				required={props.state.field.validation?.required || false}
			/>
		</>
	);
};
