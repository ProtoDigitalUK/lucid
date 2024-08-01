import T from "@/translations";
import { type Component, createMemo, For } from "solid-js";
import useSearchParamsState from "@/hooks/useSearchParamsState";
import mediaSelectStore from "@/store/forms/mediaSelectStore";
import contentLocaleStore from "@/store/contentLocaleStore";
import api from "@/services/api";
import Query from "@/components/Groups/Query";
import Grid from "@/components/Groups/Grid";
import MediaBasicCard, {
	MediaBasicCardLoading,
} from "@/components/Cards/MediaBasicCard";
import Modal from "@/components/Groups/Modal";

const MediaSelectModal: Component = () => {
	const open = createMemo(() => mediaSelectStore.get.open);

	// ---------------------------------
	// Render
	return (
		<Modal.Root
			state={{
				open: open(),
				setOpen: () => mediaSelectStore.set("open", false),
			}}
			options={{
				noPadding: true,
				size: "large",
			}}
		>
			<SelectMediaContent />
		</Modal.Root>
	);
};

const SelectMediaContent: Component = () => {
	// ------------------------------
	// Hooks
	const searchParams = useSearchParamsState(
		{
			filters: {
				name: {
					value: "",
					type: "text",
				},
				extension: {
					value: mediaSelectStore.get.extensions || "",
					type: "text",
				},
				type: {
					value: mediaSelectStore.get.type || "",
					type: "array",
				},
			},
			sorts: {
				fileSize: undefined,
				name: undefined,
				width: undefined,
				height: undefined,
				createdAt: undefined,
				updatedAt: "desc",
			},
			pagination: {
				perPage: 20,
			},
		},
		{
			singleSort: true,
		},
	);

	// ----------------------------------
	// Memos
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale,
	);

	// ----------------------------------
	// Queries
	const media = api.media.useGetMultiple({
		queryParams: {
			queryString: searchParams.getQueryString,
			headers: {
				"lucid-content-locale": contentLocale,
			},
		},
	});

	// ----------------------------------
	// Render
	return (
		<div class="min-h-[70vh] flex flex-col">
			{/* Header */}
			<div class="px-15 md:px-30 pt-15 md:pt-30">
				<h2>{T()("select_media_title")}</h2>
				<p class="mt-1">{T()("select_media_description")}</p>
				<div class="w-full mt-15 flex justify-between pb-15 border-b border-border">
					<div class="flex gap-5">
						<Query.Filter
							filters={[
								{
									label: T()("name"),
									key: "name",
									type: "text",
								},
								{
									label: T()("type"),
									key: "type",
									type: "multi-select",
									options: [
										{
											label: T()("image"),
											value: "image",
										},
										{
											label: T()("video"),
											value: "video",
										},
										{
											label: T()("audio"),
											value: "audio",
										},
										{
											label: T()("document"),
											value: "document",
										},
										{
											label: T()("archive"),
											value: "archive",
										},
										{
											label: T()("unknown"),
											value: "unknown",
										},
									],
								},
								{
									label: T()("file_extension"),
									key: "extension",
									type: "text",
								},
							]}
							searchParams={searchParams}
						/>
						<Query.Sort
							sorts={[
								{
									label: T()("name"),
									key: "name",
								},
								{
									label: T()("file_size"),
									key: "fileSize",
								},
								{
									label: T()("width"),
									key: "width",
								},
								{
									label: T()("height"),
									key: "height",
								},
								{
									label: T()("created_at"),
									key: "createdAt",
								},
								{
									label: T()("updated_at"),
									key: "updatedAt",
								},
							]}
							searchParams={searchParams}
						/>
					</div>
					<div>
						<Query.PerPage
							options={[10, 20, 40]}
							searchParams={searchParams}
						/>
					</div>
				</div>
			</div>
			{/* Body */}
			<div class="relative w-full flex h-full flex-col justify-between px-15 md:px-30 pb-15 md:pb-30 mt-15 flex-grow">
				<Grid.Modal
					items={media.data?.data.length || 0}
					state={{
						isLoading: media.isLoading,
						isError: media.isError,
						isSuccess: media.isSuccess,
					}}
					searchParams={searchParams}
					meta={media.data?.meta}
					loadingCard={<MediaBasicCardLoading />}
				>
					<For each={media.data?.data}>
						{(item) => (
							<MediaBasicCard
								media={item}
								contentLocale={contentLocale()}
								selected={
									item.id === mediaSelectStore.get.selected
								}
								onClick={() => {
									mediaSelectStore.get.onSelectCallback(item);
									mediaSelectStore.set("open", false);
								}}
							/>
						)}
					</For>
				</Grid.Modal>
			</div>
		</div>
	);
};

export default MediaSelectModal;
