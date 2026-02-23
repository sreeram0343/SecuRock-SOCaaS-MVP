export default function Logo({ classNameText = "text-xl" }: { classNameText?: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`${classNameText} font-bold tracking-tight text-white`}>
                SecuRock <span className="text-securock-gold">SOC</span>
            </span>
        </div>
    );
}
