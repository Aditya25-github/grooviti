// hooks/useLenis.jsx or .tsx
import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScrolling({ children }) {
  const lenisOptions = {
    lerp: 0.1, // Controls smoothness: lower = smoother
    duration: 1.5, // Animation duration
    smoothTouch: false, // Enable/disable smooth for touch devices
    smooth: true, // Enable smooth scroll globally
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
