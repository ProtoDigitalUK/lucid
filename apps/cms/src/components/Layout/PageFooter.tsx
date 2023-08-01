import { Component, JSXElement, onMount } from "solid-js";

interface PageLayoutFooterProps {
  children: JSXElement;
}

const PageFooter: Component<PageLayoutFooterProps> = (props) => {
  let footerEle: HTMLElement | undefined;

  // ----------------------------------------
  // Functions
  function setFooterHeight() {
    if (footerEle) {
      document.documentElement.style.setProperty(
        "--lucid_page-layout-footer-height",
        `${footerEle.offsetHeight}px`
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
      class="absolute bottom-0 left-0 right-0 border-t border-border p-30"
    >
      {props.children}
    </footer>
  );
};

export default PageFooter;
