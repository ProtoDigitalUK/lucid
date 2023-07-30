import { Component, createMemo } from "solid-js";
import { CollectionResT } from "@lucid/types/src/collections";
import classNames from "classnames";
// Assets
import defaultBrickIcon from "@/assets/svgs/default-brick-icon.svg";
// Components
import CheckboxInput from "@/components/Inputs/Checkbox";

interface EnvCollectionCardProps {
  collection: CollectionResT;
  selectedCollections: string[];
  setSelected: (collection: CollectionResT) => void;
}

const EnvCollectionCard: Component<EnvCollectionCardProps> = (props) => {
  // ----------------------------------------
  // Memos
  const isSelected = createMemo(() => {
    return props.selectedCollections.some(
      (key) => key === props.collection.key
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
        }
      )}
      onClick={() => props.setSelected(props.collection)}
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
        <span class="text-sm">Selected</span>
        <div>
          <CheckboxInput
            id={props.collection.key}
            name={props.collection.key}
            value={isSelected()}
            onChange={() => {}}
            copy={{}}
            noMargin={true}
          />
        </div>
      </div>
    </li>
  );
};

export default EnvCollectionCard;
