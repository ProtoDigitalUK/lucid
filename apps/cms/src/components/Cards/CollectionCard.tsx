import T from "@/translations";
import { type Component, createMemo } from "solid-js";
import type { CollectionResT } from "@headless/types/src/collections";
import classNames from "classnames";
// Components
import Form from "@/components/Groups/Form";

interface EnvCollectionCardProps {
	collection: CollectionResT;
	selectedCollections: string[];
	setSelected: (_collection: CollectionResT) => void;
}

const EnvCollectionCard: Component<EnvCollectionCardProps> = (props) => {
	// ----------------------------------------
	// Memos
	const isSelected = createMemo(() => {
		return props.selectedCollections.some(
			(key) => key === props.collection.key,
		);
	});

	// ----------------------------------------
	// Render
	return (
		<li
			class={classNames(
				"border-border border rounded-md bg-container overflow-hidden cursor-pointer hover:border-secondary transition-colors duration-200 flex flex-col justify-between",
				{
					"border-secondary": isSelected(),
				},
			)}
			onClick={() => props.setSelected(props.collection)}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					props.setSelected(props.collection);
				}
			}}
		>
			<div class="w-full p-15 flex flex-col">
				<h3 class="text-base">{props.collection.title}</h3>
				{props.collection.description && (
					<p class="line-clamp-2 text-sm mt-1">
						{props.collection.description}
					</p>
				)}
			</div>
			<div class="w-full bg-background border-t border-border py-2.5 px-15 flex items-center justify-between">
				<span class="text-sm">{T("selected")}</span>
				<div>
					<Form.Checkbox
						id={props.collection.key}
						name={props.collection.key}
						value={isSelected()}
						onChange={() => props.setSelected(props.collection)}
						copy={{}}
						noMargin={true}
					/>
				</div>
			</div>
		</li>
	);
};

export default EnvCollectionCard;
