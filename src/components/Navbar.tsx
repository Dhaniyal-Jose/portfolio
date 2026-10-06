import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | undefined;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smoothScroll = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1,
    });
    lenis = smoothScroll;
    // Touch devices keep their native momentum; wheel scrolling uses one shared ticker.
    smoothScroll.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => smoothScroll.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const navigate = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      const target = anchor?.getAttribute("href");
      if (!target || !document.querySelector(target)) return;
      event.preventDefault();
      setMenuOpen(false);
      smoothScroll.scrollTo(target, { offset: -100, immediate: reducedMotion });
      history.replaceState(null, "", target);
    };
    const header = document.querySelector(".header");
    header?.addEventListener("click", navigate as EventListener);
    return () => {
      header?.removeEventListener("click", navigate as EventListener);
      gsap.ticker.remove(tick);
      smoothScroll.off("scroll", ScrollTrigger.update);
      smoothScroll.destroy();
      if (lenis === smoothScroll) lenis = undefined;
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="#landingDiv" className="navbar-title" data-cursor="disable" aria-label="Dhaniyal Jose — back to top">
          <img
            src="/images/profile-neon-purple.png"
            alt="Dhaniyal Jose"
            className="profile-avatar"
            width="64"
            height="64"
          />
          <span className="navbar-name">DHANIYAL <span>JOSE</span></span>
        </a>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=dhaniyaljosek@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-connect"
          data-cursor="disable"
        >
          dhaniyaljosek@gmail.com
        </a>
        <button className="nav-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="portfolio-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "Close" : "Menu"}<span>{menuOpen ? "−" : "+"}</span>
        </button>
        <ul id="portfolio-navigation" className={menuOpen ? "nav-open" : ""}>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#career" href="#career">
              <HoverLinks text="CAREER" />
            </a>
          </li>
          <li>
            <a data-href="#certifications" href="#certifications">
              <HoverLinks text="CERTIFICATIONS" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
