import T from "@/translations";
import { type Component, Show } from "solid-js";
import { FaSolidHouse } from "solid-icons/fa";
import Table from "@/components/Groups/Table";

interface PageTitleColProps {
	title: string | null;
	slug: string | null;
	full_slug: string | null;
	homepage: boolean;
	options?: {
		include?: boolean;
	};
}

const PageTitleCol: Component<PageTitleColProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<Table.Td
			options={{
				include: props?.options?.include,
			}}
		>
			<div class="flex flex-col">
				<span class="flex items-center">
					{props.title || T("no_translation")}
					<Show when={props.homepage}>
						<span
							class="ml-2 fill-primary block"
							title={T("this_is_the_homepage")}
						>
							<FaSolidHouse size={12} />
						</span>
					</Show>
				</span>
				<span class="text-sm mt-1 text-unfocused ">
					{props.full_slug || props.slug}
				</span>
			</div>
		</Table.Td>
	);
};

export default PageTitleCol;
