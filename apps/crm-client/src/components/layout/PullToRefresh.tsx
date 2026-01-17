import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useHaptic } from '../../hooks/useHaptic';

interface PullToRefreshProps {
    children: React.ReactNode;
    onRefresh: () => Promise<void>;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const haptics = useHaptic();
    const controls = useAnimation();

    const y = useMotionValue(0);
    const rotate = useTransform(y, [0, 80], [0, 360]);
    const opacity = useTransform(y, [0, 40], [0, 1]);

    const handleDragEnd = async () => {
        if (y.get() > 80) {
            haptics.trigger('medium');
            setIsRefreshing(true);
            y.set(80); // Snap to threshold

            try {
                await onRefresh();
                haptics.trigger('success');
            } finally {
                setIsRefreshing(false);
                controls.start({ y: 0 });
            }
        } else {
            controls.start({ y: 0 });
        }
    };

    return (
        <div className="relative h-full overflow-hidden" ref={containerRef}>
            {/* Loading Indicator Layer */}
            <motion.div
                style={{ opacity, rotate }}
                className="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none"
            >
                <div className="bg-white rounded-full p-2 shadow-lg border border-slate-100">
                    <RefreshCw
                        className={`text-[#EC008C] ${isRefreshing ? 'animate-spin' : ''}`}
                        size={20}
                    />
                </div>
            </motion.div>

            {/* Draggable Content Layer */}
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ y }}
                className="h-full touch-pan-y"
            >
                {children}
            </motion.div>
        </div>
    );
};
