import T from "@/translations";
import { type Component, createMemo, For, onCleanup } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
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
	const location = useLocation();
	const navigate = useNavigate();

	const searchParams = useSearchParamsState(
		{
			filters: {
				name: {
					value: undefined,
					type: "text",
				},
				extension: {
					value: mediaSelectStore.get.extensions || undefined,
					type: "text",
				},
				type: {
					value: mediaSelectStore.get.type || undefined,
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
	// Mount
	onCleanup(() => {
		navigate(location.pathname);
	});

	// ----------------------------------
	// Render
	return (
		<div class="">
			{/* Header */}
			<div class="px-15 md:px-30 pt-15 md:pt-30">
				<h2>{T()("select_media_title")}</h2>
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
			<div class="relative w-full flex flex-grow h-full flex-col justify-between px-15 md:px-30 pb-15 md:pb-30 mt-15">
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
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
				dapibus eros pellentesque, pretium erat eget, bibendum massa.
				Nam sed luctus enim, vitae placerat tortor. Maecenas
				consectetur, enim quis fringilla molestie, dolor risus volutpat
				erat, eu pharetra tortor metus id nisl. Aenean sed nunc eleifend
				quam sagittis molestie. Donec at ante ipsum. Nulla lectus
				mauris, consectetur volutpat enim vitae, dictum tristique velit.
				Aliquam at eleifend lacus. Fusce libero sapien, suscipit in
				libero sit amet, finibus dignissim nibh. Nulla sed nisl felis.
				Fusce imperdiet imperdiet ante, in tempus magna hendrerit nec.
				Curabitur tortor tortor, iaculis ac dignissim a, viverra sed
				tortor. Sed eleifend varius magna, ut bibendum ante. Curabitur
				eget condimentum ex. Duis at nisi aliquet, egestas ex a,
				efficitur purus. Integer euismod porttitor tincidunt. Vivamus
				leo magna, ultricies quis felis sit amet, pretium sollicitudin
				justo. Cras tincidunt pharetra sodales. Donec placerat ultricies
				nisi, non consectetur sem gravida et. Phasellus vestibulum ante
				a lacinia porta. Vivamus ornare sit amet sapien sed tristique.
				Duis at felis mollis, aliquam sem eu, euismod leo. Donec vel
				ullamcorper purus, quis malesuada dolor. Vivamus mattis orci
				vitae eros posuere, eu eleifend libero tincidunt. In nec lectus
				auctor, tristique ex eget, ultricies lectus. Cras aliquam
				vehicula magna, eget iaculis felis placerat et.Lorem ipsum dolor
				sit amet, consectetur adipiscing elit. Vivamus dapibus eros
				pellentesque, pretium erat eget, bibendum massa. Nam sed luctus
				enim, vitae placerat tortor. Maecenas consectetur, enim quis
				fringilla molestie, dolor risus volutpat erat, eu pharetra
				tortor metus id nisl. Aenean sed nunc eleifend quam sagittis
				molestie. Donec at ante ipsum. Nulla lectus mauris, consectetur
				volutpat enim vitae, dictum tristique velit. Aliquam at eleifend
				lacus. Fusce libero sapien, suscipit in libero sit amet, finibus
				dignissim nibh. Nulla sed nisl felis. Fusce imperdiet imperdiet
				ante, in tempus magna hendrerit nec. Curabitur tortor tortor,
				iaculis ac dignissim a, viverra sed tortor. Sed eleifend varius
				magna, ut bibendum ante. Curabitur eget condimentum ex. Duis at
				nisi aliquet, egestas ex a, efficitur purus. Integer euismod
				porttitor tincidunt. Vivamus leo magna, ultricies quis felis sit
				amet, pretium sollicitudin justo. Cras tincidunt pharetra
				sodales. Donec placerat ultricies nisi, non consectetur sem
				gravida et. Phasellus vestibulum ante a lacinia porta. Vivamus
				ornare sit amet sapien sed tristique. Duis at felis mollis,
				aliquam sem eu, euismod leo. Donec vel ullamcorper purus, quis
				malesuada dolor. Vivamus mattis orci vitae eros posuere, eu
				eleifend libero tincidunt. In nec lectus auctor, tristique ex
				eget, ultricies lectus. Cras aliquam vehicula magna, eget
				iaculis felis placerat et.Lorem ipsum dolor sit amet,
				consectetur adipiscing elit. Vivamus dapibus eros pellentesque,
				pretium erat eget, bibendum massa. Nam sed luctus enim, vitae
				placerat tortor. Maecenas consectetur, enim quis fringilla
				molestie, dolor risus volutpat erat, eu pharetra tortor metus id
				nisl. Aenean sed nunc eleifend quam sagittis molestie. Donec at
				ante ipsum. Nulla lectus mauris, consectetur volutpat enim
				vitae, dictum tristique velit. Aliquam at eleifend lacus. Fusce
				libero sapien, suscipit in libero sit amet, finibus dignissim
				nibh. Nulla sed nisl felis. Fusce imperdiet imperdiet ante, in
				tempus magna hendrerit nec. Curabitur tortor tortor, iaculis ac
				dignissim a, viverra sed tortor. Sed eleifend varius magna, ut
				bibendum ante. Curabitur eget condimentum ex. Duis at nisi
				aliquet, egestas ex a, efficitur purus. Integer euismod
				porttitor tincidunt. Vivamus leo magna, ultricies quis felis sit
				amet, pretium sollicitudin justo. Cras tincidunt pharetra
				sodales. Donec placerat ultricies nisi, non consectetur sem
				gravida et. Phasellus vestibulum ante a lacinia porta. Vivamus
				ornare sit amet sapien sed tristique. Duis at felis mollis,
				aliquam sem eu, euismod leo. Donec vel ullamcorper purus, quis
				malesuada dolor. Vivamus mattis orci vitae eros posuere, eu
				eleifend libero tincidunt. In nec lectus auctor, tristique ex
				eget, ultricies lectus. Cras aliquam vehicula magna, eget
				iaculis felis placerat et.Lorem ipsum dolor sit amet,
				consectetur adipiscing elit. Vivamus dapibus eros pellentesque,
				pretium erat eget, bibendum massa. Nam sed luctus enim, vitae
				placerat tortor. Maecenas consectetur, enim quis fringilla
				molestie, dolor risus volutpat erat, eu pharetra tortor metus id
				nisl. Aenean sed nunc eleifend quam sagittis molestie. Donec at
				ante ipsum. Nulla lectus mauris, consectetur volutpat enim
				vitae, dictum tristique velit. Aliquam at eleifend lacus. Fusce
				libero sapien, suscipit in libero sit amet, finibus dignissim
				nibh. Nulla sed nisl felis. Fusce imperdiet imperdiet ante, in
				tempus magna hendrerit nec. Curabitur tortor tortor, iaculis ac
				dignissim a, viverra sed tortor. Sed eleifend varius magna, ut
				bibendum ante. Curabitur eget condimentum ex. Duis at nisi
				aliquet, egestas ex a, efficitur purus. Integer euismod
				porttitor tincidunt. Vivamus leo magna, ultricies quis felis sit
				amet, pretium sollicitudin justo. Cras tincidunt pharetra
				sodales. Donec placerat ultricies nisi, non consectetur sem
				gravida et. Phasellus vestibulum ante a lacinia porta. Vivamus
				ornare sit amet sapien sed tristique. Duis at felis mollis,
				aliquam sem eu, euismod leo. Donec vel ullamcorper purus, quis
				malesuada dolor. Vivamus mattis orci vitae eros posuere, eu
				eleifend libero tincidunt. In nec lectus auctor, tristique ex
				eget, ultricies lectus. Cras aliquam vehicula magna, eget
				iaculis felis placerat et.
			</div>
		</div>
	);
};

export default MediaSelectModal;
