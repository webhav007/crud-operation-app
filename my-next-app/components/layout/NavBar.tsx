"use client";

import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "./themeToggle";
import { useState } from "react";
import Avatar from "./Avatar";


export default function Navbar() {
    const user = useAuthStore((s) => s.user);

    return (
        <>
            <nav
                className="w-full px-6 py-4 flex justify-between items-center"
                style={{
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: 'var(--background)'
                }}
            >
                <h1 className="text-xl font-semibold">Jumbo Dashboard</h1>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <div className="flex items-center gap-2">
                        <Avatar name={user.name} />
                        <span>{user.name}</span>
                    </div>
                </div>
            </nav>


        </>
    );
}
