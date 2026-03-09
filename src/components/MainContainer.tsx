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

const TechStack = lazy(() => import("./TechStack"));
const ParticleTree = lazy(() => import("./ParticleTree"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isSnowing, setIsSnowing] = useState<boolean>(false);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
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
            {isDesktopView && (
              <Suspense fallback={<div></div>}>
                <ParticleTree />
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
