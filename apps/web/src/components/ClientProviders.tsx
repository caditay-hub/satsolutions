"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ContactConversionTracker } from "./ContactConversionTracker";

const AosInit = dynamic(() => import("./AosInit").then(m => m.AosInit), { ssr: false });
const ChatWidgetDynamic = dynamic(() => import("./ChatWidgetDynamic").then(m => m.ChatWidgetDynamic), { ssr: false });

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Чат-виджет не участвует в первом экране: монтируем по первому взаимодействию
    // или через 5 с — его чанк и гидрация не должны сидеть в TBT главной.
    useEffect(() => {
        let done = false;
        const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
        const arm = () => {
            if (done) return;
            done = true;
            events.forEach((e) => window.removeEventListener(e, arm));
            setMounted(true);
        };
        events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
        const t = window.setTimeout(arm, 5000);
        return () => {
            window.clearTimeout(t);
            events.forEach((e) => window.removeEventListener(e, arm));
        };
    }, []);

    return (
        <>
            <AosInit />
            <ContactConversionTracker />
            {children}
            {mounted && <ChatWidgetDynamic />}
        </>
    );
}
