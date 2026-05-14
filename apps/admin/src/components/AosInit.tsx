"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import("aos");
      if (!mounted) return;
      mod.default.init({
        duration: 550,
        easing: "ease-out-cubic",
        once: true,
        offset: 30
      });
      mod.default.refreshHard();
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    (async () => {
      const mod = await import("aos");
      mod.default.refresh();
    })();
  }, [pathname]);

  return null;
}

