'use client'

interface RandomPatternProps {
  seed: string
  className?: string
}

// 用 seed 决定用哪张图，同一个 seed 每次都选同一张
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function RandomPattern({ seed, className = '' }: RandomPatternProps) {
  const index = (hashCode(seed) % 6) + 1
  return (
    <div className={`absolute inset-0 ${className}`}>
      <img
        src={`/patterns/gradient-${index}.svg`}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  )
}
