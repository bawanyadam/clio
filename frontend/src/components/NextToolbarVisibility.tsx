"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const STYLE_ID = "clio-hide-next-toolbar-style";
const TOOLBAR_SELECTOR = "[data-nextjs-dev-tools-button]";

function applyToolbarVisibility(shouldShowToolbar: boolean) {
  const portals = document.querySelectorAll("nextjs-portal");

  portals.forEach((portal) => {
    const shadowRoot = (portal as HTMLElement).shadowRoot;
    if (!shadowRoot) return;

    const existingStyle = shadowRoot.getElementById(STYLE_ID);

    if (shouldShowToolbar) {
      existingStyle?.remove();
      return;
    }

    if (existingStyle) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `${TOOLBAR_SELECTOR} { display: none !important; }`;
    shadowRoot.appendChild(style);
  });
}

export default function NextToolbarVisibility() {
  const searchParams = useSearchParams();
  const shouldShowToolbar = searchParams.get("settings") === "true";

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const observer = new MutationObserver(() => {
      applyToolbarVisibility(shouldShowToolbar);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    applyToolbarVisibility(shouldShowToolbar);

    return () => {
      observer.disconnect();
    };
  }, [shouldShowToolbar]);

  return null;
}
