"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ContactConversionTracker } from "./ContactConversionTracker";

const AosInit = dynamic(() => import("./AosInit").then(m => m.AosInit), { ssr: false });
const ChatWidgetDynamic = dynamic(() => import("./ChatWidgetDynamic").then(m => m.ChatWidgetDynamic), { ssr: false });

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
