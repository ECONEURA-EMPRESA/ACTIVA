import { useEffect, useState, useRef } from 'react';

export const IntroParticles = ({ onComplete }: { onComplete: () => void }) => {
    const [isVisible, setIsVisible] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 1200); // Allow exit animation
        }, 3800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let frame = 0;

        // Neural Network Nodes
        const nodes: { x: number; y: number; vx: number; vy: number; connections: number[] }[] = [];
        const nodeCount = 50;
        const connectionDistance = 150;

        // Initialize Nodes nicely distributed
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                connections: []
            });
        }

        let animationFrameId: number;

        const render = () => {
            frame++;

            // Background: Clinical Deep Blue
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(1, '#020617');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw Grid (Medical Graph feel)
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
            ctx.lineWidth = 1;
            const gridSize = 50;
            // Moving Grid Effect
            const offset = (frame * 0.5) % gridSize;

            for (let x = offset; x < width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = offset; y < height; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }

            // Update & Draw Nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off edges
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                // Draw Node
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#3B82F6';
                ctx.fill();

                // Draw Connections
                nodes.forEach((otherNode, j) => {
                    if (i === j) return;
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = 1 - (dist / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`; // Blue connections
                        ctx.stroke();

                        // "Data Packet" traveling
                        if (frame % 120 === 0 && Math.random() > 0.9) {
                            // Logic for packet would go here, simplified for perf
                        }
                    }
                });
            });

            // Central "Scanning" Ring
            const ringSize = Math.min(width, height) * 0.25;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#EC008C';
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, ringSize, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(236, 0, 140, 0.1)`; // Pink ring base
            ctx.lineWidth = 2;
            ctx.stroke();

            // Active Scan Arc
            const angle = (frame * 0.02) % (Math.PI * 2);
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, ringSize, angle, angle + 1); // 1 radian arc
            ctx.strokeStyle = '#EC008C';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset

            animationFrameId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
            <canvas ref={canvasRef} className="absolute inset-0" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 tracking-tighter mb-4 animate-pulse font-['Outfit']">
                    ACTIVA
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#EC008C]"></div>
                    <span className="text-[#3B82F6] font-mono text-xs tracking-[0.3em] uppercase">Sincronizando</span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#EC008C]"></div>
                </div>
            </div>
        </div>
    );
};
