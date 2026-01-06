export const triggerConfetti = () => {
    const colors = ['#EC008C', '#3B82F6', '#FFFFFF'];

    // Create 50 confetti particles
    for (let i = 0; i < 50; i++) {
        const div = document.createElement('div');
        div.classList.add('confetti');

        // Random Start Position (centered)
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(div);

        // Calculate Random Trajectory
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const tx = Math.cos(angle) * velocity * 200; // 200px spread
        const ty = Math.sin(angle) * velocity * 200;

        // Animate via Web Animations API for high performance
        const animation = div.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        });

        // Cleanup after animation
        animation.onfinish = () => div.remove();
    }
};
