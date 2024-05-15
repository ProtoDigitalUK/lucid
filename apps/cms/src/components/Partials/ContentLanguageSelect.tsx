import {
	type Component,
	Match,
	Switch,
	createMemo,
	type Accessor,
} from "solid-js";
import contentLocaleStore from "@/store/contentLocaleStore";
import Form from "@/components/Groups/Form";

interface contentLocaleSelectProps {
	value?: string | undefined;
	setValue?: (_value: string | undefined) => void;
	hasError?: boolean;
}

const contentLocaleSelect: Component<contentLocaleSelectProps> = (props) => {
	// ----------------------------------
	// Memos
	const contentLocale = createMemo(
		() => contentLocaleStore.get.contentLocale,
	);
	const languages = createMemo(() => contentLocaleStore.get.languages);

	// ----------------------------------------
	// Render
	return (
		<Switch>
			<Match when={props.value === undefined}>
				<Form.Select
					id={"content-language"}
					value={contentLocale()}
					onChange={(value) => {
						if (!value)
							contentLocaleStore.get.setcontentLocale(undefined);
						else
							contentLocaleStore.get.setcontentLocale(
								value.toString(),
							);
					}}
					name={"content-language"}
					options={
						languages().map((language) => ({
							value: language.code,
							label: `${
								language.name
									? `${language.name} (${language.code})`
									: language.code
							} ${language.isDefault ? "(Default)" : ""}`,
						})) || []
					}
					noMargin={true}
					noClear={true}
					hasError={props.hasError}
				/>
			</Match>
			<Match when={props.value !== undefined}>
				<Form.Select
					id={"content-language"}
					value={props.value}
					onChange={(value) => {
						if (!value) props.setValue?.(undefined);
						else props.setValue?.(value.toString());
					}}
					name={"content-language"}
					options={
						languages().map((language) => ({
							value: language.code,
							label: `${
								language.name
									? `${language.name} (${language.code})`
									: language.code
							} ${language.isDefault ? "(Default)" : ""}`,
						})) || []
					}
					noMargin={true}
					noClear={true}
					hasError={props.hasError}
				/>
			</Match>
		</Switch>
	);
};

export default contentLocaleSelect;
