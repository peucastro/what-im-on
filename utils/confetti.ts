import confetti from 'canvas-confetti';

export function triggerConfetti() {
  const end = Date.now() + 1 * 1000; // 1 second
  const colors = ['#000000', '#ffffff', '#10b981', '#3b82f6'];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: Math.random() * 360,
      spread: Math.random() * 360,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
}
