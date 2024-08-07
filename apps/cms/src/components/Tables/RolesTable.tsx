import T from "@/translations";
import { type Component, Index } from "solid-js";
import { FaSolidT, FaSolidCalendar } from "solid-icons/fa";
import api from "@/services/api";
import useRowTarget from "@/hooks/useRowTarget";
import type useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import Table from "@/components/Groups/Table";
import RoleRow from "@/components/Tables/Rows/RoleRow";
import UpsertRolePanel from "@/components/Panels/Role/UpsertRolePanel";
import DeleteRole from "@/components/Modals/Role/DeleteRole";
import Layout from "@/components/Groups/Layout";

interface RolesTableProps {
	searchParams: ReturnType<typeof useSearchParamsLocation>;
	state: {
		setOpenCreateRolePanel: (state: boolean) => void;
	};
}

const RolesTable: Component<RolesTableProps> = (props) => {
	// ----------------------------------
	// Hooks
	const rowTarget = useRowTarget({
		triggers: {
			update: false,
			delete: false,
		},
	});

	// ----------------------------------
	// Queries
	const roles = api.roles.useGetMultiple({
		queryParams: {
			queryString: props.searchParams.getQueryString,
			include: {
				permissions: false,
			},
		},
		enabled: () => props.searchParams.getSettled(),
	});

	// ----------------------------------
	// Render
	return (
		<>
			<Layout.PageTable
				rows={roles.data?.data.length || 0}
				meta={roles.data?.meta}
				searchParams={props.searchParams}
				state={{
					isLoading: roles.isLoading,
					isError: roles.isError,
					isSuccess: roles.isSuccess,
				}}
				options={{
					showNoEntries: true,
				}}
				callbacks={{
					createEntry: () => {
						props.state.setOpenCreateRolePanel(true);
					},
				}}
				copy={{
					noEntryTitle: T()("no_roles"),
					noEntryDescription: T()("no_roles_description"),
					noEntryButton: T()("create_role"),
				}}
			>
				<Table.Root
					key={"roles.list"}
					rows={roles.data?.data.length || 0}
					searchParams={props.searchParams}
					head={[
						{
							label: T()("name"),
							key: "name",
							icon: <FaSolidT />,
							sortable: true,
						},
						{
							label: T()("created_at"),
							key: "createdAt",
							icon: <FaSolidCalendar />,
							sortable: true,
						},
						{
							label: T()("updated_at"),
							key: "updatedAt",
							icon: <FaSolidCalendar />,
						},
					]}
					state={{
						isLoading: roles.isLoading,
						isSuccess: roles.isSuccess,
					}}
					options={{
						isSelectable: false,
					}}
				>
					{({ include, isSelectable, selected, setSelected }) => (
						<Index each={roles.data?.data || []}>
							{(role, i) => (
								<RoleRow
									index={i}
									role={role()}
									include={include}
									selected={selected[i]}
									rowTarget={rowTarget}
									options={{
										isSelectable,
									}}
									callbacks={{
										setSelected: setSelected,
									}}
								/>
							)}
						</Index>
					)}
				</Table.Root>
			</Layout.PageTable>

			<UpsertRolePanel
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().update,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("update", state);
					},
				}}
			/>
			<DeleteRole
				id={rowTarget.getTargetId}
				state={{
					open: rowTarget.getTriggers().delete,
					setOpen: (state: boolean) => {
						rowTarget.setTrigger("delete", state);
					},
				}}
			/>
		</>
	);
};

export default RolesTable;
