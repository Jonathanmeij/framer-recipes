import { cn } from "../utils/cn";

export default function Container({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("w-full max-w-screen-lg md:p-6 mx-auto", className)}>
            {children}
        </div>
    );
}
