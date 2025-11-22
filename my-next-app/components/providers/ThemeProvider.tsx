"use client";

import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const dark = useThemeStore((s) => s.dark);

    useEffect(() => {
        if (dark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [dark]);

    return <>{children}</>;
}
