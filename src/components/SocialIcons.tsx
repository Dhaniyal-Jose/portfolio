import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const social = document.getElementById("social") as HTMLElement;
    const cleanups: (() => void)[] = [];
    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const onMouseMove = (e: MouseEvent) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          link.style.setProperty("--siLeft", `${x}px`);
          link.style.setProperty("--siTop", `${y}px`);
        }
      };
      const reset = () => {
        link.style.setProperty("--siLeft", "50%");
        link.style.setProperty("--siTop", "50%");
      };
      elem.addEventListener("mousemove", onMouseMove);
      elem.addEventListener("mouseleave", reset);
      cleanups.push(() => {
        elem.removeEventListener("mousemove", onMouseMove);
        elem.removeEventListener("mouseleave", reset);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/Dhaniyal-Jose" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/dhaniyal-jose" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://wa.me/919447217461" target="_blank">
            <FaWhatsapp />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/dhaniyal_jose_?igsh=Z3NrbHB4MHp6czdk&utm_source=qr" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a className="resume-button" href="/resume/Dhaniyal_Jose_Resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open Dhaniyal Jose's resume PDF">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
