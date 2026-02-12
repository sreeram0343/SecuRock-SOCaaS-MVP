import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "hover-shine" | "featured";
}

export default function GlassCard({
    children,
    className,
    variant = "default",
    ...props
}: GlassCardProps) {

    const baseStyles = "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-xl transition-all duration-300";

    const variants = {
        default: "",
        "hover-shine": "hover:shadow-[0_0_30px_rgba(0,217,255,0.1)] hover:border-securock-blue/30 group",
        featured: "border-securock-blue/20 bg-securock-blue/[0.05] shadow-[0_0_20px_rgba(0,217,255,0.1)]",
    };

    return (
        <div
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {/* Optional: Add internal glow or shine effect here */}
            {variant === "hover-shine" && (
                <div className="absolute inset-0 bg-gradient-to-br from-securock-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
