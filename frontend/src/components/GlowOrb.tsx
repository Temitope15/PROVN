interface GlowOrbProps {
  color?: 'purple' | 'cyan'
  size?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  opacity?: number
}

export default function GlowOrb({
  color = 'purple',
  size = 400,
  top,
  left,
  right,
  bottom,
  opacity = 0.15,
}: GlowOrbProps) {
  const bg = color === 'purple'
    ? 'radial-gradient(circle, rgba(123,94,167,0.4) 0%, rgba(123,94,167,0) 70%)'
    : 'radial-gradient(circle, rgba(79,196,207,0.4) 0%, rgba(79,196,207,0) 70%)'

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        opacity,
        background: bg,
        filter: 'blur(60px)',
      }}
      aria-hidden="true"
    />
  )
}
