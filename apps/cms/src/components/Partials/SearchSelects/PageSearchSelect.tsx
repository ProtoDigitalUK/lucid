import { type Component, createMemo, createSignal } from "solid-js";
import T from "@/translations";
// Services
import api from "@/services/api";
// Stores
import contentLanguage from "@/store/contentLanguageStore";
// Types
import type { ValueT, SelectProps } from "@/components/Groups/Form/Select";
import type { ErrorResult } from "@/types/api";
// Components
import Form from "@/components/Groups/Form";

interface PageSearchSelectProps {
	value: ValueT;
	setValue: (_value: ValueT) => void;
	collectionKey: string;
	name: string;
	id: string;
	copy?: SelectProps["copy"];
	errors?: ErrorResult;
	theme?: "basic";
}

const PageSearchSelect: Component<PageSearchSelectProps> = (props) => {
	const [getSearchQuery, setSearchQuery] = createSignal<string>("");
	const language = createMemo(() => contentLanguage.get.contentLanguage);

	// ----------------------------------
	// Queries
	const pages = api.collections.multiplePages.useGetMultiple({
		queryParams: {
			filters: {
				collection_key: props.collectionKey,
				title: getSearchQuery,
			},
			headers: {
				"headless-content-lang": language,
			},
			perPage: 10,
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
				isLoading: pages.isLoading,
			}}
			options={
				pages.data?.data
					.filter((page) => page.homepage !== true)
					.map((page) => ({
						value: page.id,
						label:
							page.title_translations.find(
								(t) => t.language_id === language(),
							)?.value || T("no_translation"),
					})) || []
			}
			errors={props.errors}
			theme={props.theme}
		/>
	);
};

export default PageSearchSelect;
