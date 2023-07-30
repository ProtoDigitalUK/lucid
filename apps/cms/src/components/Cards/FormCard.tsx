import { Component, createMemo } from "solid-js";
import { FormResT } from "@lucid/types/src/forms";
import classNames from "classnames";
// Assets
import defaultBrickIcon from "@/assets/svgs/default-brick-icon.svg";
// Components
import CheckboxInput from "@/components/Inputs/Checkbox";

interface EnvFormCardProps {
  form: FormResT;
  selectedForms: string[];
  setSelected: (form: FormResT) => void;
}

const EnvFormCard: Component<EnvFormCardProps> = (props) => {
  // ----------------------------------------
  // Memos
  const isSelected = createMemo(() => {
    return props.selectedForms.some((key) => key === props.form.key);
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
      onClick={() => props.setSelected(props.form)}
    >
      <div class="w-full p-15 flex flex-col">
        <h3 class="text-base">{props.form.title}</h3>
        {props.form.description && (
          <p class="line-clamp-2 text-sm mt-1">{props.form.description}</p>
        )}
      </div>
      <div class="w-full bg-background border-t border-border py-2.5 px-15 flex items-center justify-between">
        <span class="text-sm">Selected</span>
        <div>
          <CheckboxInput
            id={props.form.key}
            name={props.form.key}
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

export default EnvFormCard;
