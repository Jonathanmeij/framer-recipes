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

    const clientY = useMotionValue(0);
    const overflow = useMotionValue(0);
    const ref = useRef<ElementRef<typeof Slider.Root>>(null);

    function decay(value: number, max: number) {
        const entry = value / max;
        const sigmoid = 2 / (1 + Math.exp(-entry)) - 1;

        return sigmoid * max;
    }

    useMotionValueEvent(clientY, "change", (latest) => {
        if (ref.current) {
            const bounds = ref.current.getBoundingClientRect();
            let newOverflow = 0;

            if (latest < bounds.top) {
                setRegion("top");
                newOverflow = bounds.top - latest;
            } else if (latest > bounds.bottom) {
                setRegion("bottom");
                newOverflow = latest - bounds.bottom;
            } else {
                setRegion("middle");
                newOverflow = 0;
            }

            overflow.jump(decay(newOverflow, 30));
        }
    });

    return (
        <div className="flex flex-col items-center justify-center gap-12 py-12">
            <Slider.Root
                ref={ref}
                className="relative flex items-center w-20 w-full select-none grow max-h-56 cursor-grab touch-none active:cursor-grabbing"
                value={[volume]}
                onValueChange={(values) => setVolume(values[0])}
                orientation="vertical"
                onPointerMove={(e) => {
                    if (e.buttons > 0) {
                        clientY.set(e.clientY);
                    }
                }}
                onLostPointerCapture={() => {
                    animate(overflow, 0, {
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                    });
                }}
            >
                <motion.div
                    style={{
                        scaleY: useTransform(() => {
                            if (!ref.current) return 1;
                            const bounds = ref.current.getBoundingClientRect();

                            return (bounds.height + overflow.get()) / bounds.height;
                        }),
                        transformOrigin: region === "top" ? "bottom" : "top",
                        y: useTransform(() => {
                            if (region === "top") return decay(-overflow.get() / 4, 30);
                            if (region === "bottom") return decay(overflow.get() / 4, 30);
                            return 0;
                        }),
                        scaleX: useTransform(() => {
                            if (!ref.current) return 1;
                            const bounds = ref.current.getBoundingClientRect();

                            return (bounds.width - overflow.get() / 8) / bounds.width;
                        }),
                    }}
                    className="flex h-56 grow"
                >
                    <Slider.Track className="relative h-full w-full isolate overflow-hidden rounded-[1.6rem] grow bg-zinc-800">
                        <Slider.Range className="absolute w-full bg-zinc-100 " />
                    </Slider.Track>
                </motion.div>
            </Slider.Root>
        </div>
    );
}
