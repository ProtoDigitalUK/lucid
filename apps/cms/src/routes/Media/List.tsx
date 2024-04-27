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
				fileExtension: {
					value: "",
					type: "text",
				},
				type: {
					value: "",
					type: "array",
				},
				mimeType: {
					value: "",
					type: "text",
				},
				key: {
					value: "",
					type: "text",
				},
			},
			sorts: {
				fileSize: undefined,
				title: undefined,
				width: undefined,
				height: undefined,
				mimeType: undefined,
				fileExtension: undefined,
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
							key: "mimeType",
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
							key: "fileExtension",
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
							key: "fileSize",
						},
						{
							label: T("mime_type"),
							key: "mimeType",
						},
						{
							label: T("file_extension"),
							key: "fileExtension",
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
							key: "createdAt",
						},
						{
							label: T("updated_at"),
							key: "updatedAt",
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
