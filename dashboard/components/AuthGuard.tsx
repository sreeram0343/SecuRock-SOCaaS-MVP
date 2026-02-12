
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        // Mock Auth Check
        const token = localStorage.getItem("token")
        // For MVP demo, we assume authenticated if token exists or just allow specific routes
        // In production, verify token with Clerk/Auth0
        const isPublic = pathname === "/login"

        if (!token && !isPublic) {
            // Redirect to login (mock)
            // router.push("/login") 
            // For now, allow access to show the dashboard
            setAuthorized(true)
        } else {
            setAuthorized(true)
        }
    }, [pathname, router])

    if (!authorized) {
        return <div className="flex h-screen items-center justify-center">Checking permissions...</div>
    }

    return <>{children}</>
}
