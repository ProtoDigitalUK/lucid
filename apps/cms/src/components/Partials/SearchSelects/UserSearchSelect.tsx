import T from "@/translations";
import { type Component, createSignal } from "solid-js";
import type { ValueT, SelectProps } from "@/components/Groups/Form/Select";
import type { ErrorResult, FieldErrors } from "@lucidcms/core/types";
import api from "@/services/api";
import helpers from "@/utils/helpers";
import Form from "@/components/Groups/Form";

interface UserSearchSelectProps {
	value: ValueT;
	setValue: (_value: ValueT) => void;
	name: string;
	id: string;
	copy?: SelectProps["copy"];
	errors?: ErrorResult | FieldErrors;
	altLocaleHasError?: boolean;
	theme?: "basic";
	disabled?: boolean;
	required?: boolean;
}

const UserSearchSelect: Component<UserSearchSelectProps> = (props) => {
	const [getSearchQuery, setSearchQuery] = createSignal<string>("");

	// ----------------------------------
	// Queries
	const users = api.users.useGetMultiple({
		queryParams: {
			filters: {
				username: getSearchQuery,
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
			copy={{
				...props.copy,
				searchPlaceholder: T()("search_by_username"),
			}}
			name={props.name}
			search={{
				value: getSearchQuery(),
				onChange: setSearchQuery,
				isLoading: users.isLoading,
			}}
			options={
				users.data?.data.map((user) => ({
					value: user.id,
					label: helpers.formatUserName(user, "username"),
				})) || []
			}
			errors={props.errors}
			altLocaleHasError={props.altLocaleHasError}
			theme={props.theme}
			disabled={props.disabled}
			required={props.required}
			noClear={false}
		/>
	);
};

export default UserSearchSelect;
