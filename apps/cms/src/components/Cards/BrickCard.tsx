import { Component, createMemo, createSignal } from "solid-js";
import { BrickConfigT } from "@lucid/types/src/bricks";
import classNames from "classnames";
// Assets
import defaultBrickIcon from "@/assets/svgs/default-brick-icon.svg";
// Components
import Form from "@/components/Groups/Form";

interface EnvBrickCardProps {
  brick: BrickConfigT;
  selectedBricks: string[];
  setSelected: (brick: BrickConfigT) => void;
}

const EnvBrickCard: Component<EnvBrickCardProps> = (props) => {
  // ----------------------------------------
  // Memos
  const isSelected = createMemo(() => {
    return props.selectedBricks.some((key) => key === props.brick.key);
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
      onClick={() => props.setSelected(props.brick)}
    >
      <div class="w-full p-15 flex">
        <span class="block mr-2.5 mt-0.5">
          <img src={defaultBrickIcon} alt={props.brick.title} class="h-5" />
        </span>
        <h3 class="text-base">{props.brick.title}</h3>
      </div>
      <div class="w-full bg-background border-t border-border py-2.5 px-15 flex items-center justify-between">
        <span class="text-sm">Selected</span>
        <div>
          <Form.Checkbox
            id={props.brick.key}
            name={props.brick.key}
            value={isSelected()}
            onChange={() => props.setSelected(props.brick)}
            copy={{}}
            noMargin={true}
          />
        </div>
      </div>
    </li>
  );
};

export default EnvBrickCard;
