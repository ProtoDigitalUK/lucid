import T from "@/translations";
import { type Component, Index } from "solid-js";
import { FaSolidT, FaSolidCalendar } from "solid-icons/fa";
// Services
import api from "@/services/api";
// Hooks
import useRowTarget from "@/hooks/useRowTarget";
import type useSearchParams from "@/hooks/useSearchParams";
// Components
import Table from "@/components/Groups/Table";
import RoleRow from "@/components/Tables/Rows/RoleRow";
import UpsertRolePanel from "@/components/Panels/Role/UpsertRolePanel";
import DeleteRole from "@/components/Modals/Role/DeleteRole";

interface RolesTableProps {
	searchParams: ReturnType<typeof useSearchParams>;
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
			<Table.Root
				key={"roles.list"}
				rows={roles.data?.data.length || 0}
				meta={roles.data?.meta}
				searchParams={props.searchParams}
				head={[
					{
						label: T("name"),
						key: "name",
						icon: <FaSolidT />,
						sortable: true,
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
					isLoading: roles.isLoading,
					isError: roles.isError,
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
