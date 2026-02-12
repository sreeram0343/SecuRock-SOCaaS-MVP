/**
 * SecuRock 3D Scroll Animation
 * Ports Framer Motion 'ContainerScroll' to Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.scroll-container');
    const card = document.querySelector('.scroll-card');

    if (!container || !card) return;

    // Configuration
    const ROTATION_RANGE = 20; // Degrees to rotate X
    const TRANSLATE_RANGE = -100; // Pixels to move up
    const PERSPECTIVE = '1000px';

    function handleScroll() {
        // Calculate scroll progress relative to container
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Start animating when container enters viewport
        // End when it's fully visible or center
        const start = viewportHeight;
        const end = 0; // Top of viewport

        // Normalize scroll progress (0 to 1)
        // 0 = Start of animation (Card is tilted)
        // 1 = End of animation (Card is flat)
        let progress = (start - rect.top) / (start - end);
        progress = Math.min(Math.max(progress, 0), 1); // Clamp 0-1

        // Interpolate values
        const currentRotate = 20 - (progress * 20); // 20 -> 0
        const currentScale = 1.05 - (progress * 0.05); // 1.05 -> 1
        const currentTranslate = 0 + (progress * TRANSLATE_RANGE); // 0 -> -100

        // Apply Styles
        card.style.transform = `
            perspective(${PERSPECTIVE})
            rotateX(${currentRotate}deg)
            scale(${currentScale})
            translateY(${currentTranslate}px)
        `;

        // Dynamic Shadow intensity
        const shadowOpacity = 0.5 - (progress * 0.2);
        card.style.boxShadow = `
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 20px 50px rgba(0, 0, 0, ${shadowOpacity})
        `;
    }

    // Initial call
    handleScroll();

    // Bind global scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
});
