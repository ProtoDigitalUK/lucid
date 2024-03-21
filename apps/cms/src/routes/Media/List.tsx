import T from "@/translations";
import { type Component, createSignal } from "solid-js";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Store
import userStore from "@/store/userStore";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import MediaGrid from "@/components/Grids/MediaGrid";
import CreateUpdateMediaPanel from "@/components/Panels/Media/CreateUpdateMediaPanel";

const MediaListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const searchParams = useSearchParams(
		{
			filters: {
				title: {
					value: "",
					type: "text",
				},
				file_extension: {
					value: "",
					type: "text",
				},
				type: {
					value: "",
					type: "array",
				},
				mime_type: {
					value: "",
					type: "text",
				},
				key: {
					value: "",
					type: "text",
				},
			},
			sorts: {
				file_size: undefined,
				title: undefined,
				width: undefined,
				height: undefined,
				mime_type: undefined,
				file_extension: undefined,
				created_at: undefined,
				updated_at: "desc",
			},
			pagination: {
				per_page: 20,
			},
		},
		{
			singleSort: true,
		},
	);
	const [getOpenCreateMediaPanel, setOpenCreateMediaPanel] =
		createSignal<boolean>(false);

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T("media_route_title")}
			description={T("media_route_description")}
			headingChildren={
				<Query.Row
					searchParams={searchParams}
					filters={[
						{
							label: T("title"),
							key: "title",
							type: "text",
						},
						{
							label: T("mime_type"),
							key: "mime_type",
							type: "text",
						},
						{
							label: T("key"),
							key: "key",
							type: "text",
						},
						{
							label: T("type"),
							key: "type",
							type: "multi-select",
							options: [
								{
									label: T("image"),
									value: "image",
								},
								{
									label: T("video"),
									value: "video",
								},
								{
									label: T("audio"),
									value: "audio",
								},
								{
									label: T("document"),
									value: "document",
								},
								{
									label: T("archive"),
									value: "archive",
								},
								{
									label: T("unknown"),
									value: "unknown",
								},
							],
						},
						{
							label: T("file_extension"),
							key: "file_extension",
							type: "text",
						},
					]}
					sorts={[
						{
							label: T("title"),
							key: "title",
						},
						{
							label: T("file_size"),
							key: "file_size",
						},
						{
							label: T("mime_type"),
							key: "mime_type",
						},
						{
							label: T("file_extension"),
							key: "file_extension",
						},
						{
							label: T("width"),
							key: "width",
						},
						{
							label: T("height"),
							key: "height",
						},
						{
							label: T("created_at"),
							key: "created_at",
						},
						{
							label: T("updated_at"),
							key: "updated_at",
						},
					]}
					perPage={[10, 20, 40]}
				/>
			}
			actions={{
				create: {
					open: getOpenCreateMediaPanel(),
					setOpen: setOpenCreateMediaPanel,
					permission: userStore.get.hasPermission(["create_media"])
						.all,
				},
				contentLanguage: true,
			}}
		>
			<MediaGrid searchParams={searchParams} />
			<CreateUpdateMediaPanel
				state={{
					open: getOpenCreateMediaPanel(),
					setOpen: setOpenCreateMediaPanel,
				}}
			/>
		</Layout.PageLayout>
	);
};

export default MediaListRoute;
