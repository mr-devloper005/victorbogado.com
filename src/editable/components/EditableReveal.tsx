'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

/*
  Lightweight scroll reveal — progressive enhancement only.

  Server render and no-JS clients show content fully visible (the base `.er`
  class has no hidden state). On the client we "arm" the hidden start state
  ONLY for elements that are still below the fold, then reveal them with
  IntersectionObserver as they scroll in. Elements already in view on load are
  never armed, so there is no above-the-fold flash. Honors reduced-motion.
*/
type EditableRevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger in ms, applied as a transition-delay. */
  delay?: number
}

export function EditableReveal({ children, as: Tag = 'div', className = '', delay = 0 }: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    // Already visible on load? Leave it be — no arming, no flash.
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh * 0.9) return

    el.classList.add('er-armed')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.remove('er-armed')
            el.classList.add('er-in')
            io.unobserve(el)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`er ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}
