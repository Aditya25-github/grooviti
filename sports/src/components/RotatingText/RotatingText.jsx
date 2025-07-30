"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './RotatingText.module.css';

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts = [],
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "words",
    onNext,
    mainClassName = '',
    splitLevelClassName = '',
    elementLevelClassName = '',
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 'auto', height: 'auto' });

  // Measure all texts to find the maximum dimensions
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;
    const tempSpan = document.createElement('span');
    tempSpan.style.position = 'absolute';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.fontFamily = getComputedStyle(container).fontFamily;
    tempSpan.style.fontSize = getComputedStyle(container).fontSize;
    tempSpan.style.fontWeight = getComputedStyle(container).fontWeight;
    
    document.body.appendChild(tempSpan);

    let maxWidth = 0;
    let maxHeight = 0;
    
    texts.forEach(text => {
      tempSpan.textContent = text;
      const rect = tempSpan.getBoundingClientRect();
      if (rect.width > maxWidth) maxWidth = rect.width;
      if (rect.height > maxHeight) maxHeight = rect.height;
    });

    document.body.removeChild(tempSpan);
    setDimensions({
      width: `${maxWidth}px`,
      height: `${maxHeight}px`
    });
  }, [texts]);

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0
        ? loop
          ? texts.length - 1
          : currentTextIndex
        : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset,
    }),
    [next, previous, jumpTo, reset]
  );

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  return (
    <motion.span
      ref={containerRef}
      className={cn(styles.rotateContainer, mainClassName)}
      {...rest}
      style={{
        ...rest.style,
        display: 'inline-flex',
        justifyContent: 'center',
        minWidth: dimensions.width,
        height: dimensions.height,
        overflow: 'hidden',
        verticalAlign: 'bottom'
      }}
      layout
      transition={transition}
    >
      <span className={styles.srOnly}>{texts[currentTextIndex]}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          className={cn(styles.wordWrapper, mainClassName)}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            position: 'absolute'
          }}
        >
          {texts[currentTextIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;