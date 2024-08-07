import T from "@/translations";
import {
	type Component,
	createMemo,
	createSignal,
	Show,
	For,
	createEffect,
	type Accessor,
} from "solid-js";
import api from "@/services/api";
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
import type { MediaResponse } from "@lucidcms/core/types";
import helpers from "@/utils/helpers";
import dateHelpers from "@/utils/date-helpers";
import { getBodyError, getErrorObject } from "@/utils/error-helpers";
import contentLocaleStore from "@/store/contentLocaleStore";
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import SectionHeading from "@/components/Blocks/SectionHeading";
import DetailsList from "@/components/Partials/DetailsList";

interface CreateUpdateMediaPanelProps {
	id?: Accessor<number | undefined>;
	state: {
		open: boolean;
		setOpen: (_state: boolean) => void;
	};
}

const CreateUpdateMediaPanel: Component<CreateUpdateMediaPanelProps> = (
	props,
) => {
	const panelMode = createMemo(() => {
		return props.id === undefined ? "create" : "update";
	});

	// ---------------------------------
	// Queries
	const media = api.media.useGetSingle({
		queryParams: {
			location: {
				id: props.id as Accessor<number | undefined>,
			},
		},
		enabled: () => panelMode() === "update" && props.state.open,
	});

	// ------------------------------
	// State
	const [getTitle, setTitle] = createSignal<MediaResponse["title"]>([]);
	const [getAlt, setAlt] = createSignal<MediaResponse["alt"]>([]);

	// ---------------------------------
	// Mutations
	const createSingle = api.media.useCreateSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
	});
	const updateSingle = api.media.useUpdateSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
	});

	const MediaFile = useSingleFileUpload({
		id: "file",
		disableRemoveCurrent: true,
		name: "file",
		required: true,
		errors:
			panelMode() === "create"
				? createSingle.errors
				: updateSingle.errors,
		noMargin: false,
	});

	// ---------------------------------
	// Memos
	const showAltInput = createMemo(() => {
		if (MediaFile.getFile() !== null) {
			const type = helpers.getMediaType(MediaFile.getFile()?.type);
			return type === "image";
		}
		return panelMode() === "create"
			? false
			: media.data?.data.type === "image";
	});
	const locales = createMemo(() => contentLocaleStore.get.locales);
	const mutateIsLoading = createMemo(() => {
		return updateSingle.action.isPending || createSingle.action.isPending;
	});
	const mutateErrors = createMemo(() => {
		return updateSingle.errors() || createSingle.errors();
	});
	const hasTranslationErrors = createMemo(() => {
		const titleErrors = getBodyError(
			"title",
			updateSingle.errors,
		)?.children;
		const altErrors = getBodyError("alt", updateSingle.errors)?.children;
		if (titleErrors) return titleErrors.length > 0;
		if (altErrors) return altErrors.length > 0;
		return false;
	});
	const updateData = createMemo(() => {
		const { changed, data } = helpers.updateData(
			{
				title: media.data?.data.title || [],
				alt: media.data?.data.alt || [],
			},
			{
				title: getTitle(),
				alt: getAlt(),
			},
		);

		let resData: {
			title?: MediaResponse["title"];
			alt?: MediaResponse["alt"];
			file?: File;
		} = data;
		let resChanged = changed;

		if (MediaFile.getFile()) {
			resChanged = true;

			resData = {
				...data,
				file: MediaFile.getFile() || undefined,
			};
		}

		return {
			changed: resChanged,
			data: resData,
		};
	});
	const mutateIsDisabled = createMemo(() => {
		if (panelMode() === "create") {
			return MediaFile.getFile() === null;
		}
		return !updateData().changed;
	});
	const panelContent = createMemo(() => {
		if (panelMode() === "create") {
			return {
				title: T()("create_media_panel_title"),
				description: T()("create_media_panel_description"),
				submit: T()("create"),
			};
		}
		return {
			title: T()("update_media_panel_title"),
			description: T()("update_media_panel_description"),
			submit: T()("update"),
		};
	});
	const panelFetchState = createMemo(() => {
		if (panelMode() === "create") {
			return undefined;
		}
		return {
			isLoading: media.isLoading,
			isError: media.isError,
		};
	});

	// ---------------------------------
	// Functions
	const inputError = (index: number) => {
		const errors = getBodyError("translations", mutateErrors)?.children;
		if (errors) return errors[index];
		return undefined;
	};

	// ---------------------------------
	// Effects
	createEffect(() => {
		if (media.isSuccess && panelMode() === "update") {
			setTitle(media.data?.data.title || []);
			setAlt(media.data?.data.alt || []);
			MediaFile.reset();
			MediaFile.setCurrentFile({
				name: media.data.data.key,
				url: media.data?.data.url
					? `${media.data.data.url}?width=400`
					: undefined,
				type: media.data?.data.type || undefined,
			});
		}
	});

	// ---------------------------------
	// Render
	return (
		<Panel.Root
			open={props.state.open}
			setOpen={props.state.setOpen}
			onSubmit={() => {
				if (!props.id) {
					createSingle.action.mutate({
						file: MediaFile.getFile() as File,
						title: getTitle(),
						alt: getAlt(),
					});
				} else {
					updateSingle.action.mutate({
						id: props.id() as number,
						body: {
							file: MediaFile.getFile() as File,
							title: getTitle(),
							alt: getAlt(),
						},
					});
				}
			}}
			fetchState={panelFetchState()}
			reset={() => {
				createSingle.reset();
				updateSingle.reset();
				MediaFile.reset();
				setTitle([]);
				setAlt([]);
			}}
			mutateState={{
				isLoading: mutateIsLoading(),
				errors: mutateErrors(),
				isDisabled: mutateIsDisabled(),
			}}
			content={panelContent()}
			langauge={{
				contentLocale: true,
				hascontentLocaleError: hasTranslationErrors(),
				useDefaultcontentLocale: panelMode() === "create",
			}}
		>
			{(lang) => (
				<>
					<MediaFile.Render />
					<For each={locales()}>
						{(locale, index) => (
							<Show when={locale.code === lang?.contentLocale()}>
								<SectionHeading
									title={T()("details_lang", {
										code: locale.code,
									})}
								/>
								<Form.Input
									id={`name-${locale.code}`}
									value={
										helpers.getTranslation(
											getTitle(),
											locale.code,
										) || ""
									}
									onChange={(val) => {
										helpers.updateTranslation(setTitle, {
											localeCode: locale.code,
											value: val,
										});
									}}
									name={`name-${locale.code}`}
									type="text"
									copy={{
										label: T()("name"),
									}}
									errors={getErrorObject(
										inputError(index())?.name,
									)}
									theme="full"
								/>
								<Show when={showAltInput()}>
									<Form.Input
										id={`alt-${locale.code}`}
										value={
											helpers.getTranslation(
												getAlt(),
												locale.code,
											) || ""
										}
										onChange={(val) => {
											helpers.updateTranslation(setAlt, {
												localeCode: locale.code,
												value: val,
											});
										}}
										name={`alt-${locale.code}`}
										type="text"
										copy={{
											label: T()("alt"),
										}}
										errors={getErrorObject(
											inputError(index())?.alt,
										)}
										theme="full"
									/>
								</Show>
							</Show>
						)}
					</For>
					<Show when={props.id !== undefined}>
						<SectionHeading title={T()("meta")} />
						<DetailsList
							type="text"
							items={[
								{
									label: T()("file_size"),
									value: helpers.bytesToSize(
										media.data?.data.meta.fileSize ?? 0,
									),
								},
								{
									label: T()("dimensions"),
									value: `${media.data?.data.meta.width} x ${media.data?.data.meta.height}`,
									show: media.data?.data.type === "image",
								},
								{
									label: T()("extension"),
									value: media.data?.data.meta.extension,
								},
								{
									label: T()("mime_type"),
									value: media.data?.data.meta.mimeType,
								},
								{
									label: T()("created_at"),
									value: dateHelpers.formatDate(
										media.data?.data.createdAt,
									),
								},
								{
									label: T()("updated_at"),
									value: dateHelpers.formatDate(
										media.data?.data.updatedAt,
									),
								},
							]}
						/>
					</Show>
				</>
			)}
		</Panel.Root>
	);
};

export default CreateUpdateMediaPanel;
