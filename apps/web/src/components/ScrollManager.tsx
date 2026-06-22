"use client";

import { useEffect } from "react";

// Per-URL scroll restoration for back/forward navigation.
//
// Next's built-in restoration is unreliable here: the catalog fetches its product
// list on the client, so the document is still short when Next restores. Two
// failure modes were seen in practice — "jumps to top" and "lands far off". This
// component fixes both, and crucially it drives the restore from the `popstate`
// event itself rather than from a React effect: on App-Router back/forward the
// route-change effect did not fire reliably after popstate, so an effect-based
// restore never ran. The popstate listener always fires.
//
//   • SAVE   — the scroll position is saved continuously on scroll (not only on
//     <a> clicks), so programmatic navigations (filter search / category buttons
//     via router.push) are covered too. Saving is paused during a restore.
//   • RESTORE — on popstate the target for the destination URL is read (at that
//     point window.location is already the destination) and then HELD: re-asserted
//     every frame for a short window so Next's late scroll-to-0 can't win, and the
//     window is extended whenever the document grows (async products, lazy images,
//     expanded sections) until the page is tall enough to reach the target.
//
// A restore yields immediately to a real user gesture (wheel / touch / key).

let suppressSaveUntil = 0;   // ignore scroll-saves until this time (post-nav settle)
let cancelRestore: (() => void) | null = null;

const HOLD_MS = 1500;          // minimum time we hold the restored position
const GROWTH_GRACE_MS = 800;   // extra hold granted after each document-height change
const RESTORE_BUDGET_MS = 6000; // hard cap (catalog fetches products over the network)

function storageKey() {
  return "scrollpos:" + window.location.pathname + window.location.search;
}

function restoreTo(y: number) {
  cancelRestore?.();
  if (!(y > 0)) {
    suppressSaveUntil = 0;
    return;
  }

  let stop = false;
  const start = performance.now();
  let deadline = start + HOLD_MS;
  suppressSaveUntil = start + RESTORE_BUDGET_MS;

  const canReach = () =>
    document.documentElement.scrollHeight - window.innerHeight >= y - 1;
  const atTarget = () => Math.abs(window.scrollY - y) <= 1;

  const finish = () => {
    if (stop) return;
    stop = true;
    ro.disconnect();
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("keydown", cancel);
    cancelRestore = null;
    suppressSaveUntil = 0; // resume saving the user's real position
  };
  const cancel = () => finish();
  cancelRestore = finish;

  const tick = () => {
    if (stop) return;
    if (canReach() && !atTarget()) {
      window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
    }
    const now = performance.now();
    if (now > deadline || now - start > RESTORE_BUDGET_MS) {
      finish();
      return;
    }
    requestAnimationFrame(tick);
  };

  // Extend the hold whenever the document height changes (content arriving),
  // so we keep re-asserting until the page can actually reach the target.
  const ro = new ResizeObserver(() => {
    if (stop) return;
    deadline = Math.min(performance.now() + GROWTH_GRACE_MS, start + RESTORE_BUDGET_MS);
  });
  ro.observe(document.documentElement);

  // Yield instantly to a deliberate user scroll — never fight the user.
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("keydown", cancel);

  requestAnimationFrame(tick);
}

export function ScrollManager() {
  // Continuously remember the scroll position for the current URL. rAF-throttled;
  // paused (suppressSaveUntil) during a restore so the transient scroll-to-0 and
  // our own re-asserts can't clobber the stored value.
  useEffect(() => {
    let ticking = false;
    const save = () => {
      ticking = false;
      if (performance.now() < suppressSaveUntil) return;
      try {
        sessionStorage.setItem(storageKey(), String(window.scrollY));
      } catch {}
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(save);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  // Restore on back/forward (browser arrows + router.back() from
  // <GlobalBackButton/>). At popstate window.location already points at the
  // destination, so we read its saved position and start holding it right away —
  // suppressing saves first so the read value can't be overwritten meanwhile.
  useEffect(() => {
    const onPop = () => {
      suppressSaveUntil = performance.now() + RESTORE_BUDGET_MS;
      let v: string | null = null;
      try {
        v = sessionStorage.getItem(storageKey());
      } catch {}
      const y = v == null ? NaN : parseInt(v, 10);
      // Defer one frame so Next has begun swapping in the destination route.
      requestAnimationFrame(() => restoreTo(Number.isFinite(y) ? y : 0));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return null;
}
