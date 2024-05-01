import T from "@/translations";
import { useParams } from "@solidjs/router";
import { type Component, createMemo, createSignal, Show } from "solid-js";
import api from "@/services/api";
import { FaSolidTrash } from "solid-icons/fa";
import Layout from "@/components/Groups/Layout";
import Button from "@/components/Partials/Button";
import ContentLanguageSelect from "@/components/Partials/ContentLanguageSelect";
import DetailsList from "@/components/Partials/DetailsList";
import DateText from "@/components/Partials/DateText";

interface CollectionsDocumentsEditRouteProps {
	mode: "create" | "edit";
}

const CollectionsDocumentsEditRoute: Component<
	CollectionsDocumentsEditRouteProps
> = (props) => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();
	const [getDeleteOpen, setDeleteOpen] = createSignal(false);

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const documentId = createMemo(
		() => Number.parseInt(params.documentId) || undefined,
	);

	// ----------------------------------
	// Queries
	const collection = api.collections.useGetSingle({
		queryParams: {
			location: {
				collectionKey: collectionKey,
			},
		},
		enabled: () => !!collectionKey(),
	});
	const document = api.collections.document.useGetSingle({
		queryParams: {
			location: {
				collectionKey: collectionKey,
				id: documentId(),
			},
			include: {
				bricks: true,
			},
		},
		enabled: () => !!collectionKey() && !!documentId(),
	});

	// ---------------------------------
	// Functions
	const upsertDocument = async () => {};

	// ----------------------------------
	// Render
	return (
		<>
			<Layout.PageBreadcrumbs
				breadcrumbs={[
					{
						link: "/collections",
						label: T("collections"),
					},
					{
						link: `/collections/${collectionKey()}`,
						label: collection.data?.data.title || "",
						include: collection.data?.data.mode === "multiple",
					},
					{
						link: `/collections/${collectionKey()}/${
							props.mode === "create" ? "create" : documentId()
						}`,
						label:
							props.mode === "create" ? T("create") : T("edit"),
					},
				]}
				options={{
					background: "white",
				}}
			/>
			{/* Main */}
			<div class="w-full lg:pr-[350px]">
				{/* Header */}
				<header class="bg-white border-b border-border">
					<div class="p-15 md:p-30 flex items-center justify-between flex-wrap-reverse md:flex-nowrap gap-15">
						<h1 class="w-full">
							{T("document_route_title", {
								mode: T("edit"),
								name:
									collection.data?.data.singular ??
									T("document"),
							})}
							<Show when={props.mode === "edit"}>
								<span class="text-unfocused ml-2.5">
									#{document.data?.data.id}
								</span>
							</Show>
						</h1>
						<div class="w-full md:w-auto flex items-center gap-2.5">
							<Show when={collection.data?.data.translations}>
								<div class="w-full md:w-auto md:min-w-[250px]">
									{/* TODO: update hasError with memo that detects translations errors */}
									<ContentLanguageSelect hasError={false} />
								</div>
							</Show>
							<Button
								type="button"
								theme="primary"
								size="small"
								onClick={upsertDocument}
							>
								{T("save", {
									singular:
										collection.data?.data.singular || "",
								})}
							</Button>
							<Show when={props.mode === "edit"}>
								<Button
									theme="danger"
									size="icon"
									type="button"
									onClick={() => setDeleteOpen(true)}
								>
									<span class="sr-only">{T("delete")}</span>
									<FaSolidTrash />
								</Button>
							</Show>
						</div>
					</div>
				</header>
				{/* content */}
			</div>
			{/* Sidebar */}
			<aside class="w-full lg:w-[350px] lg:overflow-scroll bg-white border-b lg:border-b-0 lg:border-l border-border lg:fixed lg:top-[51px] lg:right-0 lg:bottom-0">
				<div class="p-15 md:p-30">
					<h2 class="mb-15">{T("document")}</h2>
					<DetailsList
						type="text"
						items={[
							{
								label: T("collection"),
								value: collection.data?.data.title,
							},
							{
								label: T("created_by"),
								value: document.data?.data.createdBy,
								show: props.mode === "edit",
							},
							{
								label: T("created_at"),
								value: (
									<DateText
										date={document.data?.data.createdAt}
									/>
								),
								show: props.mode === "edit",
							},
							{
								label: T("updated_at"),
								value: (
									<DateText
										date={document.data?.data.updatedAt}
									/>
								),
								show: props.mode === "edit",
							},
						]}
					/>
				</div>
			</aside>
		</>
	);
};

export default CollectionsDocumentsEditRoute;
