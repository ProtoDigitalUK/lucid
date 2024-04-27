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
import type { MediaResponse } from "@protoheadless/core/types";
import helpers from "@/utils/helpers";
import dateHelpers from "@/utils/date-helpers";
import { getBodyError, getErrorObject } from "@/utils/error-helpers";
import contentLanguageStore from "@/store/contentLanguageStore";
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
		enabled: () => props.id !== undefined && !!props.id(),
	});

	// ------------------------------
	// State
	const [getUpdateDataLock, setUpdateDataLock] = createSignal(false);
	const [getUpdateFileLock, setUpdateFileLock] = createSignal(false);
	const [getTitleTranslations, setTitleTranslations] = createSignal<
		MediaResponse["titleTranslations"]
	>([]);
	const [getAltTranslations, setAltTranslations] = createSignal<
		MediaResponse["altTranslations"]
	>([]);

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
	const languages = createMemo(() => contentLanguageStore.get.languages);
	const mutateIsLoading = createMemo(() => {
		return updateSingle.action.isPending || createSingle.action.isPending;
	});
	const mutateErrors = createMemo(() => {
		return updateSingle.errors() || createSingle.errors();
	});
	const hasTranslationErrors = createMemo(() => {
		const titleErrors = getBodyError(
			"titleTranslations",
			updateSingle.errors,
		)?.children;
		const altErrors = getBodyError(
			"altTranslations",
			updateSingle.errors,
		)?.children;
		if (titleErrors) return titleErrors.length > 0;
		if (altErrors) return altErrors.length > 0;
		return false;
	});
	const updateData = createMemo(() => {
		const { changed, data } = helpers.updateData(
			{
				titleTranslations: media.data?.data.titleTranslations || [],
				altTranslations: media.data?.data.altTranslations || [],
			},
			{
				titleTranslations: getTitleTranslations(),
				altTranslations: getAltTranslations(),
			},
		);

		let resData: {
			titleTranslations?: MediaResponse["titleTranslations"];
			altTranslations?: MediaResponse["altTranslations"];
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
				title: T("create_media_panel_title"),
				description: T("create_media_panel_description"),
				submit: T("create"),
			};
		}
		return {
			title: T("update_media_panel_title"),
			description: T("update_media_panel_description"),
			submit: T("update"),
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
			if (!getUpdateDataLock()) {
				setTitleTranslations(media.data?.data.titleTranslations || []);
				setAltTranslations(media.data?.data.altTranslations || []);
				setUpdateDataLock(true);
			}
			if (!getUpdateFileLock()) {
				MediaFile.reset();
				MediaFile.setCurrentFile({
					name: media.data.data.key,
					url: media.data?.data.url
						? `${media.data.data.url}?width=400`
						: undefined,
					type: media.data?.data.type || undefined,
				});
				setUpdateFileLock(true);
			}
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
						titleTranslations: getTitleTranslations(),
						altTranslations: getAltTranslations(),
					});
				} else {
					updateSingle.action.mutate({
						id: props.id() as number,
						body: {
							file: MediaFile.getFile() as File,
							titleTranslations: getTitleTranslations(),
							altTranslations: getAltTranslations(),
						},
					});
				}
			}}
			fetchState={panelFetchState()}
			reset={() => {
				createSingle.reset();
				updateSingle.reset();
				MediaFile.reset();
				setTitleTranslations([]);
				setAltTranslations([]);
				setUpdateDataLock(false);
				setUpdateFileLock(false);
			}}
			mutateState={{
				isLoading: mutateIsLoading(),
				errors: mutateErrors(),
				isDisabled: mutateIsDisabled(),
			}}
			content={panelContent()}
			langauge={{
				contentLanguage: true,
				hasContentLanguageError: hasTranslationErrors(),
				useDefaultContentLanguage: panelMode() === "create",
			}}
		>
			{(lang) => (
				<>
					<MediaFile.Render />
					<For each={languages()}>
						{(language, index) => (
							<Show
								when={language.id === lang?.contentLanguage()}
							>
								<SectionHeading
									title={T("details_lang", {
										code: language.code,
									})}
								/>
								<Form.Input
									id={`name-${language.id}`}
									value={
										getTitleTranslations().find(
											(item) =>
												item.languageId === language.id,
										)?.value || ""
									}
									onChange={(val) => {
										helpers.updateTranslation(
											setTitleTranslations,
											{
												languageId: language.id,
												value: val,
											},
										);
									}}
									name={`name-${language.id}`}
									type="text"
									copy={{
										label: T("name"),
									}}
									errors={getErrorObject(
										inputError(index())?.name,
									)}
								/>
								<Show when={showAltInput()}>
									<Form.Input
										id={`alt-${language.id}`}
										value={
											getAltTranslations().find(
												(item) =>
													item.languageId ===
													language.id,
											)?.value || ""
										}
										onChange={(val) => {
											helpers.updateTranslation(
												setAltTranslations,
												{
													languageId: language.id,
													value: val,
												},
											);
										}}
										name={`alt-${language.id}`}
										type="text"
										copy={{
											label: T("alt"),
										}}
										errors={getErrorObject(
											inputError(index())?.alt,
										)}
									/>
								</Show>
							</Show>
						)}
					</For>
					<Show when={props.id !== undefined}>
						<SectionHeading title={T("meta")} />
						<DetailsList
							type="text"
							items={[
								{
									label: T("file_size"),
									value: helpers.bytesToSize(
										media.data?.data.meta.fileSize ?? 0,
									),
								},
								{
									label: T("dimensions"),
									value: `${media.data?.data.meta.width} x ${media.data?.data.meta.height}`,
									show: media.data?.data.type === "image",
								},
								{
									label: T("extension"),
									value: media.data?.data.meta.fileExtension,
								},
								{
									label: T("mime_type"),
									value: media.data?.data.meta.mimeType,
								},
								{
									label: T("created_at"),
									value: dateHelpers.formatDate(
										media.data?.data.createdAt,
									),
								},
								{
									label: T("updated_at"),
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
