import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import useMeasure from "react-use-measure";
import { useEffect } from "react";

export default function IosAlarmPicker() {
    return (
        <div className="w-96">
            <Picker
                value="00"
                onChange={(value) => console.log(value)}
                options={Array.from({ length: 13 }, (_, i) => i.toString())}
            />
        </div>
    );
}

function Picker({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}) {
    const [ref, containerBounds] = useMeasure();
    const [refOptions, optionsBounds] = useMeasure();
    const y = useMotionValue(0);
    const ITEM_HEIGHT = 32; // height of each option (h-8 = 32px)

    // Calculate the closest snap point
    const calculateSnapPoint = (y: number) => {
        const itemIndex = Math.round(y / ITEM_HEIGHT);
        return itemIndex * ITEM_HEIGHT;
    };

    const handleDragEnd = () => {
        const currentY = y.get();
        const snapPoint = calculateSnapPoint(currentY);

        // Animate to the nearest snap point
        animate(y, snapPoint, {
            type: "spring",
            stiffness: 400,
            damping: 30,
        });

        // Calculate selected index and call onChange
        const selectedIndex = Math.abs(Math.round(snapPoint / ITEM_HEIGHT));
        onChange(options[selectedIndex]);
    };

    // Set initial position based on value prop
    useEffect(() => {
        const index = options.indexOf(value);
        if (index !== -1) {
            y.set(-index * ITEM_HEIGHT);
        }
    }, [value, options, y]);

    return (
        <div className="relative h-40 text-lg bg-blue-900" ref={ref}>
            <div className="absolute flex items-center justify-center w-full font-light -translate-y-1/2 rounded-lg top-1/2 h-7 bg-zinc-100/10"></div>
            <motion.div
                drag="y"
                ref={refOptions}
                style={{ y }}
                onDragEnd={handleDragEnd}
                dragConstraints={{
                    top: -optionsBounds.height + containerBounds.height / 2,
                    bottom: containerBounds.height / 2,
                }}
                className="absolute top-0 tabular-nums text-zinc-100"
            >
                {options.map((option) => (
                    <div className="flex items-center h-8" key={option}>
                        {option.length === 1 && 0}
                        {option}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
