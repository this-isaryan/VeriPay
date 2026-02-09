"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Search, Settings, User } from "lucide-react"

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"


export default function Header() {
    const router = useRouter()
    const { user, refresh } = useAuth()

    async function handleLogout() {
        await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            credentials: "include",
        })
        await refresh()
        router.push("/login")
    }
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between rounded-2xl bg-card/70 px-6 py-3 shadow-sm backdrop-blur-md">
            <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Signed in
                </p>
                <p className="text-sm font-semibold text-foreground">
                    {user?.full_name ?? user?.email}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
                </Button>
                <div className="mx-2 h-6 w-px bg-border/40" />
                <div className="flex items-center gap-3">
                    <nav className="hidden items-center gap-1 md:flex">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Overview
                            </Button>
                        </Link>
                        <Link href="/upload">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Upload
                            </Button>
                        </Link>
                        <Link href="/analysis">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                Analysis
                            </Button>
                        </Link>
                    </nav>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                        {user?.full_name
                                            ? user.full_name
                                                .split(" ")
                                                .map(n => n[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()
                                            : user?.email?.[0]?.toUpperCase()}

                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
                            <div className="px-2 py-1.5">
                                <p className="text-sm font-medium text-foreground">Alex Johnson</p>
                                <p className="text-xs text-muted-foreground">alex@veripay.io</p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-destructive focus:text-destructive"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}