import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power2.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power2.out" });
    const move = (event: MouseEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor], button");
      cursor.classList.toggle("cursor-disable", !!target);
    };
    document.addEventListener("mousemove", move, { passive: true });
    return () => {
      document.removeEventListener("mousemove", move);
      moveX.tween.kill();
      moveY.tween.kill();
    };
  }, []);
  return <div className="cursor-main" ref={cursorRef} aria-hidden="true" />;
};
export default Cursor;
