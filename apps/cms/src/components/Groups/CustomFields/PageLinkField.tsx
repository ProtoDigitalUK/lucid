// TODO: remove this
import { type Component, createSignal, createEffect } from "solid-js";
// Types
import type { FieldErrors } from "@protoheadless/core/types";
import type { PageLinkValueT, PageLinkMetaT } from "@headless/types/src/bricks";
import type { CustomField } from "@protoheadless/core/types";
// Utils
import brickHelpers from "@/utils/brick-helpers";
// Store
import builderStore, { type BrickStoreFieldT } from "@/store/builderStore";
// Components
import Form from "@/components/Groups/Form";

interface PageLinkFieldProps {
	state: {
		brickIndex: number;
		key: CustomField["key"];
		field: CustomField;
		groupId?: BrickStoreFieldT["group_id"];

		fieldError: FieldErrors | undefined;
		contentLanguage?: number | undefined;
	};
}

export const PageLinkField: Component<PageLinkFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<
		PageLinkValueT | undefined | null
	>();
	const [getMeta, setMeta] = createSignal<PageLinkMetaT | null>(null);

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

		const value = field?.value as PageLinkValueT | undefined | null;
		const meta = field?.meta as PageLinkMetaT | undefined | null;
		setValue(value);
		setMeta(meta || null);
	});

	// -------------------------------
	// Render
	return (
		<>
			<Form.LinkSelect
				id={`field-${props.state.key}-${props.state.brickIndex}-${props.state.groupId}`}
				type={"pagelink"}
				value={getValue()}
				onChange={(value, meta) => {
					builderStore.get.updateFieldValue({
						brickIndex: props.state.brickIndex,
						key: props.state.key,
						groupId: props.state.groupId,
						contentLanguage: props.state.contentLanguage,
						value: value,
						meta: meta,
					});
				}}
				meta={getMeta()}
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
