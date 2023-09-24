import { Component } from "solid-js";
import classNames from "classnames";
import { FaSolidPlus } from "solid-icons/fa";
// Components

interface BuilderProps {
  state: {
    setOpenSelectBrick: (_open: boolean) => void;
  };
}

export const Builder: Component<BuilderProps> = (props) => {
  // ------------------------------
  // Classes
  const addBrickBtnClasses = classNames(
    "w-8 h-8 bg-container rounded-full hover:bg-backgroundAccent flex items-center justify-center hover:rotate-90 transition-all duration-300"
  );

  // ----------------------------------
  // Render
  return (
    <>
      <div class="m-auto max-w-3xl w-full">
        {/* Fixed Top Zone */}
        <div>fixed top</div>
        {/* Builder Zone */}
        <div class="my-20 flex flex-col items-center">
          <button
            class={addBrickBtnClasses}
            onClick={() => props.state.setOpenSelectBrick(true)}
          >
            <FaSolidPlus class="w-4 h-4 fill-title" />
          </button>
          <div class="my-5 w-full">
            <div class="w-full h-10 bg-white bg-opacity-40 mb-15 last:mb-0 rounded-md">
              Banner
            </div>
            <div class="w-full h-10 bg-white bg-opacity-40 mb-15 last:mb-0 rounded-md">
              Introduction
            </div>
          </div>
          <button
            class={addBrickBtnClasses}
            onClick={() => props.state.setOpenSelectBrick(true)}
          >
            <FaSolidPlus class="w-4 h-4 fill-title" />
          </button>
        </div>
        {/* Fixed Bottom/Sidebar Zone */}
        <div>fixed bottom</div>
      </div>
    </>
  );
};

export default Builder;
