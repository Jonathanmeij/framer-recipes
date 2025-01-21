export default function ComponentCard({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="pt-6 space-y-2">
            <label className="text-lg font-medium">{title}</label>
            <div className="p-4 border rounded-lg bg-zinc-900 border-zinc-800">
                {children}
            </div>
        </div>
    );
}
