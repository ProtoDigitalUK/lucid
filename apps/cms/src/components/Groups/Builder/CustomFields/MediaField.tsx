import {
	type Component,
	createSignal,
	createMemo,
	batch,
	createEffect,
} from "solid-js";
import type {
	CFConfig,
	MediaResMeta,
	FieldResponse,
	FieldErrors,
} from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import brickHelpers from "@/utils/brick-helpers";
import helpers from "@/utils/helpers";
import Form from "@/components/Groups/Form";

interface MediaFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CFConfig<"media">;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLocale: string;
		fieldError: FieldErrors | undefined;
		altLocaleError: boolean;
	};
}

export const MediaField: Component<MediaFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal<number | undefined>();
	const [getMeta, setMeta] = createSignal<
		NonNullable<MediaResMeta> | undefined
	>();

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});
	const fieldValue = createMemo(() => {
		return brickHelpers.getFieldValue<number>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLocale: props.state.contentLocale,
		});
	});
	const fieldMeta = createMemo(() => {
		return brickHelpers.getFieldMeta<NonNullable<MediaResMeta>>({
			fieldData: fieldData(),
			fieldConfig: props.state.fieldConfig,
			contentLocale: props.state.contentLocale,
		});
	});
	const isDisabled = createMemo(
		() => props.state.fieldConfig.disabled || brickStore.get.locked,
	);

	// -------------------------------
	// Effects
	createEffect(() => {
		setValue(fieldValue());
		setMeta(fieldMeta());
	});

	// -------------------------------
	// Render
	return (
		<Form.MediaSelect
			id={brickHelpers.customFieldId({
				key: props.state.fieldConfig.key,
				brickIndex: props.state.brickIndex,
				groupId: props.state.groupId,
			})}
			value={getValue()}
			meta={getMeta()}
			onChange={(value, meta) => {
				batch(() => {
					brickStore.get.setFieldValue({
						brickIndex: props.state.brickIndex,
						fieldConfig: props.state.fieldConfig,
						key: props.state.fieldConfig.key,
						groupId: props.state.groupId,
						repeaterKey: props.state.repeaterKey,
						value: value,
						meta: meta,
						contentLocale: props.state.contentLocale,
					});
					setValue(value ?? undefined);
					setMeta(meta ?? undefined);
				});
			}}
			copy={{
				label: helpers.getLocaleValue({
					value: props.state.fieldConfig.labels.title,
				}),
				describedBy: helpers.getLocaleValue({
					value: props.state.fieldConfig.labels.description,
				}),
			}}
			altLocaleError={props.state.altLocaleError}
			disabled={isDisabled()}
			extensions={props.state.fieldConfig.validation?.extensions}
			type={props.state.fieldConfig.validation?.type}
			errors={props.state.fieldError}
			required={props.state.fieldConfig.validation?.required || false}
		/>
	);
};
