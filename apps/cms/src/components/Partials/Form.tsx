import { Component, JSXElement } from "solid-js";

interface FormProps {
  onSubmit?: () => void;
  children: JSXElement;
}

const Form: Component<FormProps> = ({ onSubmit, children }) => {
  return (
    <form
      class="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
      }}
    >
      {children}
    </form>
  );
};

export default Form;
