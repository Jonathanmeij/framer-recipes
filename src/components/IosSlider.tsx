import * as Slider from "@radix-ui/react-slider";
import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
} from "framer-motion";
import { ElementRef, useRef, useState } from "react";

export default function IosSlider() {
    const [volume, setVolume] = useState(50);
    const [region, setRegion] = useState<"top" | "middle" | "bottom">("middle");

    const position = useMotionValue(0);
    const y = useMotionValue(0);
    const ref = useRef<ElementRef<typeof Slider.Root>>(null);

    useMotionValueEvent(position, "change", (latest) => {
        if (ref.current) {
            const bounds = ref.current.getBoundingClientRect();

            if (latest < 0) {
                setRegion("top");
                y.set(-latest);
            } else if (latest > bounds.height) {
                setRegion("bottom");
                y.set(latest - bounds.height);
            } else {
                setRegion("middle");
                y.set(0);
            }
        }
    });

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
            <motion.div
                className=" test-white"
                style={{
                    y: useTransform(() => (region === "top" ? -y.get() : 0)),
                }}
            >
                test
            </motion.div>
            <Slider.Root
                ref={ref}
                className="relative flex items-center w-12 h-full select-none cursor-grab touch-none active:cursor-grabbing"
                value={[volume]}
                onValueChange={(values) => setVolume(values[0])}
                orientation="vertical"
                onPointerMove={(e) => {
                    if (e.buttons > 0) {
                        const { top } = e.currentTarget.getBoundingClientRect();
                        const overflowTop = e.clientY - top;
                        position.set(overflowTop);
                    }
                }}
                onLostPointerCapture={() => {
                    animate(y, 0, { type: "spring", stiffness: 500, damping: 32 });
                }}
            >
                <motion.div className="flex grow">
                    <motion.div
                        style={{
                            scaleY: useTransform(() => {
                                if (!ref.current) return 0;
                                const bounds = ref.current.getBoundingClientRect();

                                return (bounds.height + y.get()) / bounds.height;
                            }),
                            transformOrigin: region === "top" ? "bottom" : "top",
                        }}
                        className="flex w-12 h-full grow"
                    >
                        <Slider.Track className="relative h-32 overflow-hidden rounded-2xl grow bg-zinc-800">
                            <Slider.Range className="absolute w-full bg-zinc-100 " />
                        </Slider.Track>
                    </motion.div>
                </motion.div>
            </Slider.Root>

            <motion.div
                className=" test-white"
                style={{
                    y: region === "bottom" ? y : 0,
                }}
            >
                test
            </motion.div>

            <div>
                <p>
                    Position:{" "}
                    <motion.span>
                        {useTransform(() => Math.floor(position.get()))}
                    </motion.span>
                </p>

                <p>
                    y:{" "}
                    <motion.span>{useTransform(() => Math.floor(y.get()))}</motion.span>
                </p>

                <p>{region}</p>
            </div>
        </div>
    );
}
