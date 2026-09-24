// Adapted from Motion Primitives Animated Background (MIT).
// https://motion-primitives.com/docs/animated-background
import { Children, cloneElement, useId } from 'react';
import { motion } from 'motion/react';

export function AnimatedBackground({ children, value, onValueChange }) {
  const id = useId();
  return Children.map(children, child => cloneElement(child, {
    onClick: () => onValueChange(child.props['data-id']),
    'aria-selected': value === child.props['data-id'],
  }, <>
    {value === child.props['data-id'] && <motion.span className="tab-background" layoutId={`tab-${id}`} transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} />}
    <span className="tab-label">{child.props.children}</span>
  </>));
}
