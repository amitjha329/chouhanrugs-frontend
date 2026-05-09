"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        document.getElementById("main-container")?.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
