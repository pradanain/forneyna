export async function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { default: confetti } = await import('canvas-confetti')
  void confetti({ particleCount: 90, spread: 75, origin: { y: 0.65 }, colors: ['#F4CED8', '#D994A5', '#9B625E', '#e9c581'], disableForReducedMotion: true, zIndex: 20 })
}
