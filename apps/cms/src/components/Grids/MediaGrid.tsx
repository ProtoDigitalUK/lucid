import T from "@/translations";
import { type Component, For, createMemo } from "solid-js";
import api from "@/services/api";
import useRowTarget from "@/hooks/useRowTarget";
import type useSearchParams from "@/hooks/useSearchParams";
import contentLocaleStore from "@/store/contentLocaleStore";
import Grid from "@/components/Groups/Grid";
import MediaCard, { MediaCardLoading } from "@/components/Cards/MediaCard";
import CreateUpdateMediaPanel from "@/components/Panels/Media/CreateUpdateMediaPanel";
import DeleteMedia from "@/components/Modals/Media/DeleteMedia";
import ClearProcessedMedia from "@/components/Modals/Media/ClearProcessedImages";

interface MediaGridProps {
	searchParams: ReturnType<typeof useSearchParams>;
	state: {
		setOpenCreateMediaPanel: (state: boolean) => void;
	};
}

const MediaGrid: Component<MediaGridProps> = (props) => {
	// ----------------------------------
	// Hooks
	const rowTarget = useRowTarget({
		triggers: {
			update: false,
			delete: false,
			clear: false,
		},
	});

	// ----------------------------------
	// Memos
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale,
	);

	// ----------------------------------
	// Queries
	const media = api.media.useGetMultiple({
		queryParams: {
			queryString: props.searchParams.getQueryString,
			headers: {
				"lucid-content-locale": contentLocale,
			},
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Render
	return (
		<>
			<Grid.Root
				items={media.data?.data.length || 0}
				state={{
					isLoading: media.isLoading,
					isError: media.isError,
					isSuccess: media.isSuccess,
				}}
				options={{
					showCreateEntry: true,
				}}
				callbacks={{
					createEntry: () => {
						props.state.setOpenCreateMediaPanel(true);
					},
				}}
				copy={{
					noEntryTitle: T()("no_media"),
					noEntryDescription: T()("no_media_description"),
					noEntryButton: T()("upload_media"),
				}}
				searchParams={props.searchParams}
				meta={media.data?.meta}
				loadingCard={<MediaCardLoading />}
			>
				<For each={media.data?.data}>
					{(item) => (
						<MediaCard
							media={item}
							rowTarget={rowTarget}
							contentLocale={contentLocale()}
						/>
					)}
				</For>
			</Grid.Root>

			<CreateUpdateMediaPanel
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().update,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("update", state);
					},
				}}
			/>
			<DeleteMedia
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().delete,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("delete", state);
					},
				}}
			/>
			<ClearProcessedMedia
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().clear,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("clear", state);
					},
				}}
			/>
		</>
	);
};

export default MediaGrid;
