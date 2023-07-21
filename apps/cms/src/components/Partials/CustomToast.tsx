import { Component } from "solid-js";
import { Toast } from "solid-toast";

interface CustomToastProps {
  title: string;
  message: string;
  toast: Toast;
}

const CustomToast: Component<CustomToastProps> = (props) => {
  return (
    <div class="bg-white rounded-full py-2.5 px-5 drop-shadow-md w-80">
      <p class="text-sm font-bold mb-1">{props.title}</p>
      <p class="text-sm">{props.message}</p>
    </div>
  );
};

export default CustomToast;
