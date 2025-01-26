import { Link } from "react-router-dom";

export default function ComponentCard({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="pt-6 space-y-2 ">
            <Link to={title} className="px-6 text-lg font-medium md:px-0 hover:underline">
                {title} &rarr;
            </Link>
            <div className="flex items-center justify-center p-4 py-12 border md:rounded-lg bg-zinc-800/20 border-zinc-800">
                {children}
            </div>
        </div>
    );
}
