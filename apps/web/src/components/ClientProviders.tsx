"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SiteFooter = dynamic(() => import("./SiteFooter").then(m => m.SiteFooter), { ssr: false });
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
            {children}
            {mounted && <SiteFooter />}
            {mounted && <ChatWidgetDynamic />}
        </>
    );
}
