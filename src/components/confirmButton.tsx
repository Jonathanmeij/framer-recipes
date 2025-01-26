import { Copy, EyeOff, MoreVertical, PencilIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function ConfirmButton() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <DropdownMenu onOpenChange={(open) => setModalOpen(open)} open={modalOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                    <MoreVertical className="w-4 h-4 text-zinc-100" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48">
                <DropdownMenuItem>
                    <PencilIcon className="w-4 h-4 mr-2" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    <span>Copy</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <EyeOff className="w-4 h-4 mr-2" />
                    <span>Hide</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteButton onDelete={() => setModalOpen(false)} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DeleteButton({ onDelete }: { onDelete?: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div className="relative h-8 overflow-hidden">
            <AnimatePresence initial={false}>
                {!isDeleting && (
                    <motion.div
                        initial={{ opacity: 0, y: -36 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -36 }}
                        className="absolute w-full"
                        key="delete"
                    >
                        <DropDownItem
                            onClick={() => {
                                setIsDeleting(true);
                            }}
                            className="text-red-500"
                        >
                            <Trash2 size={16} />
                            <span>Delete</span>
                        </DropDownItem>
                    </motion.div>
                )}
                {isDeleting && (
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 36 }}
                        className="absolute w-full"
                        key="confirm-delete"
                    >
                        <div className="flex space-x-1">
                            <Button
                                size="sm"
                                className="w-full "
                                variant="destructive"
                                onClick={() => {
                                    onDelete?.();
                                    setIsDeleting(false);
                                }}
                            >
                                Confirm
                            </Button>

                            <Button
                                className="w-full"
                                size="sm"
                                variant="outline"
                                onClick={() => setIsDeleting(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const DropDownItem = forwardRef<
    HTMLButtonElement,
    {
        children: React.ReactNode;
        className?: string;
        onClick?: () => void;
    }
>(({ children, className, ...props }, ref) => {
    return (
        <button
            {...props}
            ref={ref}
            type="button"
            className={cn(
                "flex items-center rounded-sm px-2 py-1.5 space-x-2 w-full text-sm  hover:bg-zinc-800",
                className
            )}
        >
            {children}
        </button>
    );
});

DropDownItem.displayName = "DropDownItem";
