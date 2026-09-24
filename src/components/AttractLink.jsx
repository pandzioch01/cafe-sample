/** Adapted from Kokonut UI Attract Button — @dorianbaffier, MIT.
 * https://kokonutui.com/docs/buttons/attract-button
 * Coffee-colored particles, semantic anchor, keyboard focus, reduced motion.
 */
import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const particles = Array.from({ length: 7 }, (_, i) => ({
  x: Math.cos(i * Math.PI * 2 / 7) * 100,
  y: Math.sin(i * Math.PI * 2 / 7) * 35,
}));

export function AttractLink({ children, href, className = '', ...props }) {
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  return <a className={`button attract-link ${className}`} href={href} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} onFocus={() => setActive(true)} onBlur={() => setActive(false)} {...props}>
    {!reduced && particles.map((particle, i) => <motion.span key={i} aria-hidden="true" className="attract-particle" initial={false} animate={{ x: active ? 0 : particle.x, y: active ? 0 : particle.y, opacity: active ? [0.6, 0] : 0 }} transition={{ type: 'spring', stiffness: 70, damping: 12 }} />)}
    <span>{children}</span><ArrowUpRight size={17} aria-hidden="true" />
  </a>;
}
