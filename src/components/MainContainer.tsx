import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import Certifications from "./Certifications";
import setSplitText from "./utils/splitText";
import SnowEffect from "./SnowEffect";
import ScrollAtmosphere from "./ScrollAtmosphere";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isSnowing, setIsSnowing] = useState<boolean>(false);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    let previousWidth = window.innerWidth;
    const resizeHandler = () => {
      if (window.innerWidth === previousWidth) return;
      previousWidth = window.innerWidth;
      setIsDesktopView(window.innerWidth > 1024);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setSplitText();
        ScrollTrigger.refresh();
      }, 180);
    };
    setSplitText();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="container-main">
      <ScrollAtmosphere />
      <Cursor />
      {isSnowing && <SnowEffect />}

      {/* Snow Toggle Button */}
      <button
        className={`snow-toggle ${isSnowing ? 'active' : ''}`}
        onClick={() => setIsSnowing(!isSnowing)}
        aria-label="Toggle snow effect"
        title={isSnowing ? "Turn Snow Off" : "Turn Snow On"}
      >
        <span className="snow-toggle-icon">❄️</span>
        <span className="snow-toggle-text">{isSnowing ? "ON" : "OFF"}</span>
      </button>

      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Certifications />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
