import T from "@/translations";
import { type Component, createMemo, For, onCleanup } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import useSearchParams from "@/hooks/useSearchParams";
import mediaSelectStore from "@/store/forms/mediaSelectStore";
import contentLocaleStore from "@/store/contentLocaleStore";
import api from "@/services/api";
import Query from "@/components/Groups/Query";
import Panel from "@/components/Groups/Panel";
import Grid from "@/components/Groups/Grid";
import MediaBasicCard, {
	MediaBasicCardLoading,
} from "@/components/Cards/MediaBasicCard";

const SelectMediaPanel: Component = () => {
	const open = createMemo(() => mediaSelectStore.get.open);

	// ---------------------------------
	// Render
	return (
		<Panel.Root
			open={open()}
			setOpen={() => mediaSelectStore.set("open", false)}
			// fetchState={{
			// 	isLoading: media.isLoading,
			// 	isError: media.isError,
			// }}
			reset={() => {}}
			content={{
				title: T()("select_media", {
					type: "Media",
				}),
				description: T()("select_media_description"),
			}}
		>
			{(lang) => (
				<>
					<SelectMediaContent />
				</>
			)}
		</Panel.Root>
	);
};

const SelectMediaContent: Component = () => {
	// ------------------------------
	// Hooks
	const location = useLocation();
	const navigate = useNavigate();

	const searchParams = useSearchParams(
		{
			filters: {
				name: {
					value: "",
					type: "text",
				},
				fileExtension: {
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
		enabled: () => searchParams.getSettled(),
	});

	// ----------------------------------
	// Mount
	onCleanup(() => {
		navigate(location.pathname);
	});

	// ----------------------------------
	// Render
	return (
		<>
			<div class="w-full flex justify-between mb-15 pb-15 border-b border-border">
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
								key: "fileExtension",
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
			<div class="relative w-full flex flex-grow h-full flex-col justify-between">
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
		</>
	);
};

export default SelectMediaPanel;
