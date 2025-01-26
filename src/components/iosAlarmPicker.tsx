import {
    animate,
    motion,
    MotionValue,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { useEffect } from "react";
import useMeasure from "react-use-measure";

export default function IosAlarmPicker() {
    return (
        <div className="w-96">
            <Picker
                value="0"
                onChange={(value) => console.log(value)}
                options={Array.from({ length: 12 }, (_, i) => i.toString())}
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
    const optionHeight = optionsBounds.height / options.length;

    const y = useMotionValue(0);

    const relativeHeigt = (value: number) =>
        value - containerBounds.height / 2 + optionHeight / 2;

    const handleDragEnd = () => {
        const optionHeight = optionsBounds.height / options.length;
        let index = Math.round(-relativeHeigt(y.get()) / optionHeight);

        if (index < 0) index = 0;
        if (index >= options.length) index = options.length - 1;

        const snapY =
            -index * optionHeight + containerBounds.height / 2 - optionHeight / 2;

        animate(y, snapY, { type: "spring", stiffness: 500, damping: 30 });
    };

    useEffect(() => {
        if (containerBounds.height && optionsBounds.height) {
            y.set(containerBounds.height / 2 - optionHeight / 2);
        }
    }, [containerBounds, optionHeight, optionsBounds, y]);

    return (
        <div className="relative h-40 text-lg " ref={ref}>
            <div className="absolute flex items-center justify-center w-full font-light -translate-y-1/2 rounded-lg top-1/2 h-7 bg-zinc-100/5"></div>
            <motion.div
                drag="y"
                ref={refOptions}
                onDragEnd={handleDragEnd}
                dragConstraints={{
                    top: -optionsBounds.height + containerBounds.height / 2,
                    bottom: containerBounds.height / 2,
                }}
                style={{
                    y,
                }}
                className="absolute top-0 px-6 tabular-nums text-zinc-100"
            >
                {options.map((option, index) => (
                    <PickerOption
                        option={option}
                        y={y}
                        index={index}
                        optionHeight={optionHeight}
                        relativeHeigt={relativeHeigt}
                    />
                ))}
            </motion.div>

            {/* <motion.div>
                {useTransform(() => {
                    return relativeHeigt(y.get());
                })}
            </motion.div> */}
            {/* <div>{heightForIndex(1)}</div> */}
        </div>
    );
}

function PickerOption({
    option,
    y,
    index,
    optionHeight,
    relativeHeigt,
}: {
    option: string;
    y: MotionValue<number>;
    index: number;
    optionHeight: number;
    relativeHeigt: (value: number) => number;
}) {
    const heightForIndex = (index: number) => index * optionHeight;

    return (
        <motion.div
            style={{
                opacity: useTransform(() => {
                    const distance = Math.abs(
                        -heightForIndex(index) - relativeHeigt(y.get())
                    );
                    const opacity = Math.max(0, Math.min(1, 1 - distance / 75));
                    return opacity;
                }),
            }}
            className="flex items-center h-8"
            key={option}
        >
            {option.length === 1 && 0}
            {option}
        </motion.div>
    );
}
