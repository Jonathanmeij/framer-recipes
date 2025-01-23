import * as Slider from "@radix-ui/react-slider";
import {
    animate,
    AnimatePresence,
    motion,
    MotionValue,
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
                console.log("Top");
                setRegion("top");
                newOverflow = bounds.top - latest;
            } else if (latest > bounds.bottom) {
                console.log("bottom");
                setRegion("bottom");
                newOverflow = latest - bounds.bottom;
            } else {
                console.log("middle");
                setRegion("middle");
                newOverflow = 0;
            }

            overflow.jump(decay(newOverflow, 25));
        }
    });

    return (
        <div className="flex flex-col items-center justify-center gap-12 py-12">
            <Slider.Root
                ref={ref}
                className="relative flex items-center w-20 select-none grow max-h-56 cursor-grab touch-none active:cursor-grabbing"
                value={[volume]}
                onValueChange={(values) => setVolume(values[0])}
                orientation="vertical"
                onPointerMove={(e) => {
                    if (e.buttons > 0) {
                        clientY.set(e.clientY);
                    }
                }}
                onLostPointerCapture={() => {
                    animate(overflow, 0, { type: "spring", stiffness: 500, damping: 30 });
                }}
            >
                <SoundIcon
                    volume={volume}
                    y={useTransform(() => {
                        if (region === "top") return decay(-overflow.get() / 4, 30);
                        if (region === "bottom") return overflow.get();
                        return 0;
                    })}
                />

                <motion.div
                    style={{
                        scaleY: useTransform(() => {
                            if (!ref.current) return 1;
                            const bounds = ref.current.getBoundingClientRect();

                            return (bounds.height + overflow.get()) / bounds.height;
                        }),
                        transformOrigin: useTransform(() => {
                            if (ref.current) {
                                const { top } = ref.current.getBoundingClientRect();

                                return top < clientY.get() ? "top" : "bottom";
                            }
                        }),
                        y: useTransform(() => {
                            if (region === "top") return decay(-overflow.get() / 4, 30);
                            if (region === "bottom") return decay(overflow.get() / 4, 30);
                            return 0;
                        }),
                        scaleX: useTransform(() => {
                            if (!ref.current) return 1;
                            const bounds = ref.current.getBoundingClientRect();

                            return (bounds.width - overflow.get() / 7) / bounds.width;
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

function SoundIcon({ volume, y }: { volume: number; y: MotionValue<number> }) {
    const variants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 },
    };

    const base = 16.54;
    const small = 26.15;
    const medium = 33.08;
    const large = 40.38;

    return (
        <motion.svg
            style={{ y, translateX: "-50%" }}
            width={(() => {
                if (volume > 66) return large;
                if (volume > 33) return medium;
                if (volume > 0) return small;
                return base;
            })()}
            height="75"
            viewBox={(() => {
                const base = 43;
                const small = 68;
                const medium = 86;
                const large = 105;
                if (volume > 66) return `0 0 ${large} 75`;
                if (volume > 33) return `0 0 ${medium} 75`;
                if (volume > 0) return `0 0 ${small} 75`;
                return `0 0 ${base} 75`;
            })()}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute z-10 overflow-visible transform -translate-x-1/2 bottom-1 left-1/2"
        >
            <motion.path
                d="M43 7.85886C42.999 7.29321 42.801 6.74048 42.4308 6.27043C42.0606 5.80037 41.5349 5.43405 40.92 5.2177C40.3051 5.00135 39.6286 4.94466 38.9759 5.05479C38.3231 5.16491 37.7234 5.43692 37.2523 5.83649L21.0843 19.5748C20.4604 20.1083 19.718 20.5313 18.9004 20.8192C18.0827 21.1071 17.2059 21.2542 16.3209 21.252H4.77778C3.51063 21.252 2.29539 21.6798 1.39938 22.4414C0.503371 23.203 0 24.2359 0 25.313V49.6789C0 50.7559 0.503371 51.7889 1.39938 52.5504C2.29539 53.312 3.51063 53.7399 4.77778 53.7399H16.3209C17.2059 53.7377 18.0827 53.8848 18.9004 54.1727C19.718 54.4606 20.4604 54.8836 21.0843 55.4171L37.2475 69.1595C37.7186 69.5607 38.3192 69.834 38.9732 69.9448C39.6273 70.0556 40.3052 69.9989 40.9213 69.7818C41.5374 69.5648 42.0638 69.1972 42.4338 68.7257C42.8039 68.2541 43.0009 67.6998 43 67.133V7.85886Z"
                fill="#32ADE6"
            />
            <AnimatePresence mode="popLayout">
                {volume > 0 && (
                    <motion.path
                        d="M60 23C62.5964 27.0389 64 31.9514 64 37C64 42.0486 62.5964 46.9611 60 51"
                        stroke="#8BC4E1"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={variants}
                        initial="hidden"
                        exit="hidden"
                        animate="visible"
                    />
                )}
                {volume > 33 && (
                    <motion.path
                        d="M73 63C75.8533 59.6513 78.1168 55.6758 79.661 51.3005C81.2052 46.9252 82 42.2358 82 37.5C82 32.7642 81.2052 28.0748 79.661 23.6995C78.1168 19.3242 75.8533 15.3487 73 12"
                        stroke="#8BC4E1"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={variants}
                        initial="hidden"
                        exit="hidden"
                        animate="visible"
                    />
                )}
                {volume > 66 && (
                    <motion.path
                        d="M90 71C93.4874 66.6007 96.2538 61.378 98.1412 55.6301C100.029 49.8821 101 43.7215 101 37.5C101 31.2785 100.029 25.1178 98.1412 19.3699C96.2538 13.622 93.4874 8.39926 90 4"
                        stroke="#8BC4E1"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={variants}
                        initial="hidden"
                        exit="hidden"
                        animate="visible"
                    />
                )}
            </AnimatePresence>
        </motion.svg>
    );
}
