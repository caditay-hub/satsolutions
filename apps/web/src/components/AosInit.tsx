"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const initAos = async () => {
      const mod = await import("aos");
      if (!mounted) return;

      const runInit = () => {
        mod.default.init({
          duration: 800,
          easing: "ease-in-out",
          once: true,
          offset: 120,
          disableMutationObserver: true, // Performance boost
        });
      };

      if (document.readyState === "complete") {
        runInit();
      } else {
        window.addEventListener("load", runInit, { once: true });
      }
    };

    // Use a delay to ensure LCP is done
    const timeout = setTimeout(initAos, 1500);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // Recalculate positions after route change
    (async () => {
      const mod = await import("aos");
      requestAnimationFrame(() => {
        mod.default.refresh();
      });
    })();
  }, [pathname]);

  return null;
}

