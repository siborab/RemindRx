"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Logout } from "./logout";

interface Props {
    isLoggedIn: boolean
}

export default function Navbar({isLoggedIn}: Props) {

    return (
        <div className="sticky top-0 z-50 w-full shadow-lg bg-purple-400/20 h-16 flex items-center justify-between px-6">
            <div>
                <Link href="/" className="flex items-center gap-2">
                    <Pill className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-xl">RemindRx</span>
                </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
                {isLoggedIn ? (
                    <>
                    <Link
                        href="/home"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Home
                    </Link>
                    <Link
                        href="/profile"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        Profile
                    </Link>
                    <Logout/>
                    </>
                ) : (
                    <>
                    <Link href="/signin">
                        <button>Sign In</button>
                    </Link>
                    <Link href="/signup">
                        <button>Sign Up</button>
                    </Link>
                    </>
                )}
            </nav>

        </div>
    )
}