export const questionVariants = {
  enter: { x: 72, opacity: 0, scale: 0.94, filter: 'blur(6px)' },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 420, damping: 32, mass: 0.55 },
  },
  exit: {
    x: -64,
    opacity: 0,
    scale: 0.96,
    filter: 'blur(4px)',
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  },
}

export const fadeVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
}

export const sectionCompleteVariants = {
  hidden: { scale: 0.82, opacity: 0, rotateX: 8 },
  visible: {
    scale: 1,
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.55, type: 'spring', stiffness: 180, damping: 18 },
  },
}

export const archetypeContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
}

export const archetypeItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const archetypeNameVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, type: 'spring', stiffness: 160, damping: 15 },
  },
}

export const screenSlide = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.3, ease: 'easeIn' } },
}
