import T from "@/translations";
import { Component, createSignal, onCleanup, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
// Components
import Modal from "@/components/Groups/Modal";

interface NavigationGuardProps {
  state: {
    open: boolean;
    setOpen: (_open: boolean) => void;
    targetElement: HTMLLinkElement | null;
  };
}

const NavigationGuard: Component<NavigationGuardProps> = (props) => {
  // ------------------------------
  // Hooks
  const navigate = useNavigate();

  // ------------------------------
  // Render
  return (
    <Modal.Confirmation
      state={{
        open: props.state.open,
        setOpen: props.state.setOpen,
      }}
      content={{
        title: T("navigation_guard_modal_title"),
        description: T("navigation_guard_modal_description"),
      }}
      onConfirm={() => {
        if (props.state.targetElement) {
          const href = props.state.targetElement.getAttribute("href");
          if (href) navigate(href);
        }
      }}
      onCancel={() => {
        props.state.setOpen(false);
      }}
    />
  );
};

export const navGuardHook = () => {
  const [getTargetElement, setTargetElement] =
    createSignal<HTMLLinkElement | null>(null);
  const [getModalOpen, setModalOpen] = createSignal<boolean>(false);

  const clickEvent = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLLinkElement;
    if (target) {
      setTargetElement(target);
      setModalOpen(true);
    }
  };

  onMount(() => {
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", clickEvent);
    });
  });

  onCleanup(() => {
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.removeEventListener("click", clickEvent);
    });
  });

  return {
    getTargetElement,
    setTargetElement,
    getModalOpen,
    setModalOpen,
  };
};

export default NavigationGuard;