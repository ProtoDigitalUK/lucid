import T from "@/translations";
import { Component, Index, createMemo } from "solid-js";
import {
	FaSolidT,
	FaSolidCalendar,
	FaSolidCircle,
	FaSolidUser,
} from "solid-icons/fa";
import { useParams } from "@solidjs/router";
// Types
import { CollectionResT } from "@headless/types/src/collections";
// Services
import api from "@/services/api";
// Store
import contentLanguageStore from "@/store/contentLanguageStore";
import { environment } from "@/store/environmentStore";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
import useSearchParams from "@/hooks/useSearchParams";
// Components
import Table from "@/components/Groups/Table";
import PageRow from "@/components/Tables/Rows/PageRow";
import DeletePage from "@/components/Modals/Pages/DeletePage";
import CreateUpdatePagePanel from "../Panels/Pages/CreateUpdatePagePanel";

interface PagesTableProps {
	collection: CollectionResT;
	searchParams: ReturnType<typeof useSearchParams>;
}

const PagesTable: Component<PagesTableProps> = (props) => {
	// ----------------------------------
	// State & Hooks
	const params = useParams();
	const rowTarget = useRowTarget({
		triggers: {
			delete: false,
			update: false,
		},
	});

	// ----------------------------------
	// Memos
	const collectionKey = createMemo(() => params.collectionKey);
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);

	// ----------------------------------
	// Queries
	const pages = api.environment.collections.pages.useGetMultiple({
		queryParams: {
			queryString: props.searchParams.getQueryString,
			filters: {
				collection_key: collectionKey,
			},
			headers: {
				"headless-environment": environment,
				"headless-content-lang": contentLanguage,
			},
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Mutations
	const deleteMultiplePages =
		api.environment.collections.pages.useDeleteMultiple({
			collectionName: props.collection.singular,
		});

	// ----------------------------------
	// Render
	return (
		<>
			<Table.Root
				key={`collections.pages.list.${environment()}.${
					props.collection.key
				}`}
				rows={pages.data?.data.length || 0}
				meta={pages.data?.meta}
				searchParams={props.searchParams}
				head={[
					{
						label: T("title"),
						key: "title",
						icon: <FaSolidT />,
					},
					{
						label: T("status"),
						key: "published",
						icon: <FaSolidCircle />,
					},
					{
						label: T("author"),
						key: "author",
						icon: <FaSolidUser />,
					},
					{
						label: T("created_at"),
						key: "created_at",
						icon: <FaSolidCalendar />,
						sortable: true,
					},
					{
						label: T("updated_at"),
						key: "updated_at",
						icon: <FaSolidCalendar />,
					},
				]}
				state={{
					isLoading: pages.isLoading,
					isError: pages.isError,
					isSuccess: pages.isSuccess,
				}}
				options={{
					isSelectable: true,
				}}
				callbacks={{
					deleteRows: async (selected) => {
						const ids: number[] = [];
						for (const i in selected) {
							if (selected[i] && pages.data?.data[i].id) {
								ids.push(pages.data?.data[i].id);
							}
						}
						await deleteMultiplePages.action.mutateAsync({
							body: {
								ids: ids,
							},
							headers: {
								"headless-environment": environment() || "",
							},
						});
					},
				}}
			>
				{({ include, isSelectable, selected, setSelected }) => (
					<Index each={pages.data?.data || []}>
						{(page, i) => (
							<PageRow
								index={i}
								page={page()}
								collection={props.collection}
								environmentKey={environment() as string}
								include={include}
								selected={selected[i]}
								rowTarget={rowTarget}
								options={{
									isSelectable,
								}}
								callbacks={{
									setSelected: setSelected,
								}}
								contentLanguage={contentLanguage()}
							/>
						)}
					</Index>
				)}
			</Table.Root>
			<CreateUpdatePagePanel
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().update,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("update", state);
					},
				}}
				collection={props.collection}
			/>
			<DeletePage
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().delete,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("delete", state);
					},
				}}
				collection={props.collection}
			/>
		</>
	);
};

export default PagesTable;
