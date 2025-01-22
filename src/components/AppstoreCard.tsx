import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useState } from "react";

interface App {
    title: string;
    description: string;
    image: string;
}

export default function AppstoreCard() {
    const [currentApp, setCurrentApp] = useState<App | null>(null);

    return (
        <div className="flex flex-col items-center w-full py-12">
            <AppItem
                app={{
                    title: "House manager and planner",
                    description: "Home organization made easy",
                    image: "https://cdn.jim-nielsen.com/ios/512/house-manager-planner-2024-12-18.png?rf=1024",
                }}
                setCurrentApp={setCurrentApp}
            />
            <AppItem
                app={{
                    title: "Angry birds 2",
                    description: "Slingshot birds at pigs",
                    image: "https://cdn.jim-nielsen.com/ios/512/angry-birds-2-2024-09-01.png?rf=1024",
                }}
                setCurrentApp={setCurrentApp}
            />
            <AppItem
                app={{
                    title: "Guitar chords and tabs",
                    description: "Learn guitar essentials",
                    image: "https://cdn.jim-nielsen.com/ios/512/guitar-chords-tabs-2024-08-13.png?rf=1024",
                }}
                setCurrentApp={setCurrentApp}
            />
            <AppDialog
                title={currentApp?.title || ""}
                description={currentApp?.description || ""}
                image={currentApp?.image || ""}
                Open={currentApp !== null}
                setOpen={(open) => {
                    if (!open) setCurrentApp(null);
                }}
            />
        </div>
    );
}

function AppDialog({
    title,
    description,
    image,
    Open,
    setOpen,
}: {
    title: string;
    description: string;
    image: string;
    Open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <Dialog open={Open} onOpenChange={setOpen}>
            <DialogContent className="p-0 bg-transparent border-none">
                <motion.div
                    className="border rounded-lg bg-zinc-900 border-zinc-800"
                    layoutId={`app-card-${title}`}
                >
                    <DialogHeader className="flex flex-row items-center gap-4 px-4 cursor-pointer ">
                        <div className="flex-shrink-0 my-2 w-14 h-14">
                            <motion.img
                                src={image}
                                alt={title}
                                className="object-cover w-full h-full rounded-xl"
                                layoutId={`app-image-${title}`}
                            />
                        </div>
                        <div className="flex items-center justify-between text-left grow ">
                            <div className="py-4 flex items-start flex-col gap-0.5">
                                <motion.p
                                    layoutId={`app-title-${title}`}
                                    className="text-sm font-medium "
                                >
                                    {title}
                                </motion.p>
                                <motion.p
                                    className="text-sm font-light text-zinc-400"
                                    layoutId={`app-description-${title}`}
                                >
                                    {description}
                                </motion.p>
                            </div>
                            <motion.button
                                className="px-3 py-1 text-xs font-semibold text-blue-500 rounded-full bg-zinc-800 "
                                layoutId={`app-get-${title}`}
                            >
                                Get
                            </motion.button>
                        </div>
                    </DialogHeader>
                    <p className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
                        totam dolorum? Praesentium facere cum maxime quis neque provident
                        tempore omnis corrupti voluptatibus. Hic assumenda aut molestiae
                        esse qui nihil aperiam officiis commodi officia in accusantium
                        nulla tempora id laborum sequi quae perspiciatis sint eaque,
                        provident neque? Animi nam harum, officia magnam nesciunt fuga
                        vitae magni corrupti, autem quasi, deserunt recusandae ab
                        accusamus velit saepe? Nulla vel, impedit facere dolor eos
                        perspiciatis, animi quasi pariatur nemo blanditiis a maxime
                        doloremque tempore accusantium molestiae neque reiciendis fugiat?
                        Minima, magnam quisquam officia molestiae in deserunt porro itaque
                        possimus molestias dicta nobis modi maiores voluptatem totam v
                    </p>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

function AppItem({
    app,
    setCurrentApp,
}: {
    app: App;
    setCurrentApp: (app: App) => void;
}) {
    const { title, description, image } = app;
    return (
        <motion.div className="w-full  bg-zinc-900" layoutId={`app-card-${title}`}>
            <div
                className="flex items-center w-full gap-4 px-4 cursor-pointer max-w-96"
                onClick={() => setCurrentApp(app)}
            >
                <div className="flex-shrink-0 my-2 w-14 h-14">
                    <motion.img
                        src={image}
                        alt={title}
                        className="object-cover w-full h-full rounded-xl"
                        layoutId={`app-image-${title}`}
                    />
                </div>
                <div className="flex items-center justify-between text-left border-b grow border-zinc-800">
                    <div className="py-4 flex items-start flex-col gap-0.5">
                        <motion.p
                            layoutId={`app-title-${title}`}
                            className="text-sm font-medium "
                        >
                            {title}
                        </motion.p>
                        <motion.p
                            className="text-sm font-light text-zinc-400"
                            layoutId={`app-description-${title}`}
                        >
                            {description}
                        </motion.p>
                    </div>
                    <motion.button
                        className="px-3 py-1 text-xs font-semibold text-blue-500 rounded-full bg-zinc-800 "
                        layoutId={`app-get-${title}`}
                    >
                        Get
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
