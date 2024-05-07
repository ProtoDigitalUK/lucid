import {
	type Component,
	Match,
	Switch,
	createMemo,
	type Accessor,
} from "solid-js";
import contentLanguageStore from "@/store/contentLanguageStore";
import Form from "@/components/Groups/Form";

interface ContentLanguageSelectProps {
	value?: number | undefined;
	setValue?: (_value: number | undefined) => void;
	hasError?: boolean;
}

const ContentLanguageSelect: Component<ContentLanguageSelectProps> = (
	props,
) => {
	// ----------------------------------
	// Memos
	const contentLanguage = createMemo(
		() => contentLanguageStore.get.contentLanguage,
	);
	const languages = createMemo(() => contentLanguageStore.get.languages);

	// ----------------------------------------
	// Render
	return (
		<Switch>
			<Match when={props.value === undefined}>
				<Form.Select
					id={"content-language"}
					value={contentLanguage()}
					onChange={(value) => {
						if (!value)
							contentLanguageStore.get.setContentLanguage(
								undefined,
							);
						else
							contentLanguageStore.get.setContentLanguage(
								Number(value),
							);
					}}
					name={"content-language"}
					options={
						languages().map((language) => ({
							value: language.id,
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
						else props.setValue?.(Number(value));
					}}
					name={"content-language"}
					options={
						languages().map((language) => ({
							value: language.id,
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

export default ContentLanguageSelect;
