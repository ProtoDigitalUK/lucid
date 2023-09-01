import { Component, JSXElement, onMount } from "solid-js";

interface PageLayoutFooterProps {
  children: JSXElement;
}

export const PageFooter: Component<PageLayoutFooterProps> = (props) => {
  let footerEle: HTMLElement | undefined;

  // ----------------------------------------
  // Functions
  function setFooterHeight() {
    if (footerEle) {
      document.documentElement.style.setProperty(
        "--lucid-page-layout-footer-height",
        `${footerEle.offsetHeight || 0}px`
      );
    }
  }

  // ----------------------------------------
  // Mount
  onMount(() => {
    setFooterHeight();
    window.addEventListener("resize", setFooterHeight);

    const observer = new MutationObserver(setFooterHeight);
    observer.observe(footerEle!, { attributes: true, childList: true });

    return () => {
      window.removeEventListener("resize", setFooterHeight);
      observer.disconnect();
    };
  });

  // ----------------------------------------
  // Render
  return (
    <footer
      ref={footerEle}
      class="absolute bottom-0 left-0 right-0 border-t border-border p-15 md:p-30 bg-background"
    >
      {props.children}
    </footer>
  );
};
