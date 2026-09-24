// Adapted from Motion Primitives Spinning Text (MIT).
// https://motion-primitives.com/docs/spinning-text
import { motion, useReducedMotion } from 'motion/react';

export function SpinningText({ children, className = '' }) {
  const reduced = useReducedMotion();
  const letters = Array.from(children);
  return <motion.div className={`spinning-text ${className}`} aria-hidden="true" animate={{ rotate: reduced ? 0 : 360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}>
    {letters.map((letter, i) => <span key={i} style={{ transform: `translate(-50%, -50%) rotate(${360 / letters.length * i}deg) translateY(-45px)` }}>{letter}</span>)}
  </motion.div>;
}
