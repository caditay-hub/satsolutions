"use client";

import dynamic from "next/dynamic";

import { useEffect, useState } from "react";

const ChatWidget = dynamic(
    () => import("./ChatWidget").then((mod) => mod.ChatWidget),
    { ssr: false }
);

export function ChatWidgetDynamic() {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // Only load chat widget after 2 seconds or user interaction
        const timer = setTimeout(() => setShouldRender(true), 2500);
        const handleActivity = () => {
            setShouldRender(true);
            window.removeEventListener("scroll", handleActivity);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("touchstart", handleActivity);
        };
        window.addEventListener("scroll", handleActivity, { passive: true });
        window.addEventListener("mousemove", handleActivity, { passive: true });
        window.addEventListener("touchstart", handleActivity, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleActivity);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("touchstart", handleActivity);
        };
    }, []);

    if (!shouldRender) return null;
    return <ChatWidget />;
}
