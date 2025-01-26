import {
    animate,
    motion,
    MotionValue,
    PanInfo,
    useAnimationControls,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { useEffect } from "react";
import useMeasure from "react-use-measure";

export default function IosAlarmPicker() {
    return (
        <div className="w-96">
            <Picker
                value="6"
                onChange={(value) => console.log(value)}
                options={Array.from({ length: 1200 }, (_, i) => i.toString())}
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

    const controls = useAnimationControls();

    const y = useMotionValue(0);

    const relativeHeigt = (value: number) =>
        value - containerBounds.height / 2 + optionHeight / 2;

    // const handleDragEnd = () => {
    //     const optionHeight = optionsBounds.height / options.length;
    //     let index = Math.round(-relativeHeigt(y.get()) / optionHeight);

    //     if (index < 0) index = 0;
    //     if (index >= options.length) index = options.length - 1;

    //     const snapY =
    //         -index * optionHeight + containerBounds.height / 2 - optionHeight / 2;

    //     animate(y, snapY, { type: "spring", stiffness: 500, damping: 30 });

    //     onChange(options[index]);
    // };

    function handleDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
        // For example, animate back to x=0 when released
        controls.stop();
        controls
            .start({
                y: 0,
                transition: {
                    type: "inertia",
                    velocity: info.velocity.y,
                    power: 0.8, // or lower if you want less “push”
                    timeConstant: 300, // lower = ends quicker
                    restDelta: 1, // stops the animation sooner than default
                    bounceStiffness: 300,
                    bounceDamping: 20,
                },
            })
            .then(() => {
                const optionHeight = optionsBounds.height / options.length;
                let index = Math.round(-relativeHeigt(y.get()) / optionHeight);

                if (index < 0) index = 0;
                if (index >= options.length) index = options.length - 1;

                const snapY =
                    -index * optionHeight + containerBounds.height / 2 - optionHeight / 2;

                animate(y, snapY, { type: "spring", stiffness: 500, damping: 30 });

                onChange(options[index]);
            });
    }

    useEffect(() => {
        if (containerBounds.height && optionsBounds.height) {
            y.set(
                containerBounds.height / 2 -
                    optionHeight / 2 -
                    parseInt(value) * optionHeight
            );
        }
    }, [containerBounds, optionHeight, optionsBounds, y, value]);

    return (
        <div className="relative h-40 text-lg " ref={ref}>
            <div className="absolute flex items-center justify-center w-full font-light -translate-y-1/2 rounded-lg top-1/2 h-7 bg-zinc-100/5"></div>
            <motion.div
                drag="y"
                ref={refOptions}
                onDragEnd={handleDragEnd}
                animate={controls}
                dragMomentum={false}
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
                        key={option}
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
