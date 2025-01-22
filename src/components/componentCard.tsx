export default function ComponentCard({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="pt-6 space-y-2 ">
            <label className="px-6 text-lg font-medium md:px-0">{title}</label>
            <div className="p-4 border md:rounded-lg bg-zinc-900 border-zinc-800">
                {children}
            </div>
        </div>
    );
}
