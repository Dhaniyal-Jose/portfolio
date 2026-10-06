import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/ScrollAtmosphere.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollAtmosphere = () => {
  const backdrop = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.to(progress.current, {
        scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(".atmosphere-violet", {
        xPercent: 28, yPercent: 35, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 1.4 },
      });
      gsap.to(".atmosphere-cyan", {
        xPercent: -24, yPercent: -30, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 1.4 },
      });
      document.querySelectorAll(".cert-header, .contact-box").forEach((element) => {
        gsap.from(element, {
          y: 24, opacity: 0, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });
    }, backdrop);
    return () => context.revert();
  }, []);
  return <>
    <div ref={backdrop} className="scroll-atmosphere" aria-hidden="true">
      <div className="atmosphere-glow atmosphere-violet" />
      <div className="atmosphere-glow atmosphere-cyan" />
      <div className="atmosphere-grid" />
      <div className="atmosphere-vignette" />
    </div>
    <div ref={progress} className="scroll-progress" aria-hidden="true" />
  </>;
};
export default ScrollAtmosphere;
