import T from "@/translations";
import { useParams } from "@solidjs/router";
import { type Component, createMemo } from "solid-js";
import api from "@/services/api";
import Layout from "@/components/Groups/Layout";

interface CollectionsDocumentsEditRouteProps {
	mode: "create" | "edit";
}

const CollectionsDocumentsEditRoute: Component<
	CollectionsDocumentsEditRouteProps
> = (props) => {
	// ----------------------------------
	// Hooks & State
	const params = useParams();

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
					},
					{
						link: `/collections/${collectionKey()}/${
							props.mode === "create" ? "create" : documentId()
						}`,
						label:
							props.mode === "create" ? T("create") : T("edit"),
					},
				]}
			/>
			<ul>
				<li>singular: {collection.data?.data.singular}</li>
				<li>mode: {props.mode}</li>
				<li>documentId: {documentId()}</li>
				<li>collectionKey: {collectionKey()}</li>
				<li>created at: {document.data?.data.createdAt}</li>
			</ul>
		</>
	);
};

export default CollectionsDocumentsEditRoute;
