import { type Component, createSignal } from "solid-js";
import api from "@/services/api";
import helpers from "@/utils/helpers";
import type { ValueT, SelectProps } from "@/components/Groups/Form/Select";
import type { ErrorResult } from "@protoheadless/core/types";
import Form from "@/components/Groups/Form";

interface UserSearchSelectProps {
	value: ValueT;
	setValue: (_value: ValueT) => void;
	name: string;
	id: string;
	copy?: SelectProps["copy"];
	errors?: ErrorResult;
	theme?: "basic";
}

const UserSearchSelect: Component<UserSearchSelectProps> = (props) => {
	const [getSearchQuery, setSearchQuery] = createSignal<string>("");

	// ----------------------------------
	// Queries
	const users = api.users.useGetMultiple({
		queryParams: {
			filters: {
				username: getSearchQuery,
				firstName: getSearchQuery,
				lastName: getSearchQuery,
			},
		},
	});

	// ----------------------------------
	// Render
	return (
		<Form.Select
			id={props.id}
			value={props.value}
			onChange={props.setValue}
			copy={props.copy}
			name={props.name}
			search={{
				value: getSearchQuery(),
				onChange: setSearchQuery,
				isLoading: users.isLoading,
			}}
			options={
				users.data?.data.map((user) => ({
					value: user.id,
					label: helpers.formatUserName(user),
				})) || []
			}
			errors={props.errors}
			theme={props.theme}
		/>
	);
};

export default UserSearchSelect;
