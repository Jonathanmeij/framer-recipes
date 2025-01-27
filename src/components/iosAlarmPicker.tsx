import {
    animate,
    motion,
    MotionValue,
    PanInfo,
    useAnimationControls,
    useMotionValue,
    useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import useMeasure, { RectReadOnly } from "react-use-measure";

export default function IosAlarmPicker() {
    return (
        <div className="w-96">
            <Picker
                value="6"
                onChange={(value) => console.log(value)}
                options={Array.from({ length: 100 }, (_, i) => i.toString())}
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
    const animationIdRef = useRef(0); // Track the current animation ID
    const controls = useAnimationControls();
    const y = useMotionValue(0);

    const containerTopConstraint = -optionsBounds.height + containerBounds.height / 2;
    const containerBottomConstraint = containerBounds.height / 2;

    const relativeHeigt = (value: number) =>
        value - containerBounds.height / 2 + optionHeight / 2;

    function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
        // For example, animate back to x=0 when released
        controls.stop();

        const currentAnimationId = ++animationIdRef.current;

        controls
            .start({
                y: 0,
                transition: {
                    type: "inertia",
                    velocity: info.velocity.y,
                    power: 1,
                    timeConstant: 200,
                    bounceStiffness: 150,
                    bounceDamping: 30,
                    min: containerTopConstraint + optionHeight / 2,
                    max: containerBottomConstraint - optionHeight / 2,
                },
            })
            .then(() => {
                if (currentAnimationId !== animationIdRef.current) return;

                const optionHeight = optionsBounds.height / options.length;
                let index = Math.round(-relativeHeigt(y.get()) / optionHeight);
                index = Math.max(0, Math.min(index, options.length - 1));

                const snapY =
                    -index * optionHeight + containerBounds.height / 2 - optionHeight / 2;

                animate(y, snapY, {
                    type: "spring",
                    stiffness: 150,
                    damping: 30,
                    power: 1,
                });

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
        <div className="relative h-64 overflow-hidden text-lg " ref={ref}>
            <div className="absolute flex items-center justify-center w-full font-light -translate-y-1/2 rounded-lg top-1/2 h-7 bg-zinc-100/5"></div>
            <motion.div
                drag="y"
                ref={refOptions}
                onDragEnd={handleDragEnd}
                animate={controls}
                dragMomentum={false}
                dragConstraints={{
                    top: containerTopConstraint,
                    bottom: containerBottomConstraint,
                }}
                style={{
                    y,
                }}
                className="absolute top-0 flex flex-col items-center justify-center w-full px-6 tabular-nums text-zinc-100"
            >
                {options.map((option, index) => (
                    <PickerOption
                        containerBounds={containerBounds}
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
    containerBounds,
}: {
    option: string;
    y: MotionValue<number>;
    index: number;
    optionHeight: number;
    relativeHeigt: (value: number) => number;
    containerBounds: RectReadOnly;
}) {
    const heightForIndex = (index: number) => index * optionHeight;

    const percentageToBorder = (index: number) => {
        const relativeY = relativeHeigt(y.get()) + heightForIndex(index);
        const halfHeight = containerBounds.height / 2;
        const distance = Math.abs(relativeY) / halfHeight;

        return Math.max(0, Math.min(1, 1 - distance));
    };

    return (
        <motion.div
            style={{
                opacity: useTransform(() => {
                    return percentageToBorder(index);
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
