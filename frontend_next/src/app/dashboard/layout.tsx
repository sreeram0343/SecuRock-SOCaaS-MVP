export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Note: The Sidebar acts as a server/client hybrid, we can import it directly.
    // However, if Sidebar uses client hooks, it already has "use client" inside.
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* The sidebar will be rendered here dynamically */}
            <div className="w-64 flex-shrink-0 border-r border-border bg-card">
                <DynamicSidebar />
            </div>
            <main className="flex-1 overflow-y-auto bg-muted/20">
                {children}
            </main>
        </div>
    );
}

// Since Sidebar has "use client" and uses Zustand which might complain about SSR in Next.js,
// we can dynamically import it to avoid hydration mismatches if it reads localStorage on mount.
// Actually, it's safe to just import it normally if it's Client component.

import Sidebar from "@/components/layout/Sidebar";

function DynamicSidebar() {
    return <Sidebar />;
}
