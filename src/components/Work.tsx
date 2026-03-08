import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROJECTS = [
  {
    name: "Major Bakery",
    category: "Web Development",
    tools: "HTML5, CSS3, Bootstrap 5, JavaScript, Isotope.js, Swiper.js, AOS.js",
    link: "https://dhaniyal-jose.github.io/major-bakery/",
    image: "/images/major-bakery.jpg"
  },
  {
    name: "AI-Based Multisensory Aid",
    category: "Artificial Intelligence",
    tools: "Real-time sign language recognition, object detection, spatial guidance",
  },
  {
    name: "Major Goa Holidays",
    category: "Web Development",
    tools: "Responsive Design, Tailwind, React Ecosystem",
    link: "https://www.majorgoaholidays.com",
    image: "/images/major-goa.jpg"
  },
  {
    name: "Smart Medicine Box",
    category: "IoT & Mobile App",
    tools: "Flutter, Firebase, ESP32, hardware-software integration",
  },
  {
    name: "Console-Based Text Game",
    category: "Game Development",
    tools: "Conditional statements, logical programming concepts",
  },
  {
    name: "Number Pattern Generator",
    category: "Utility",
    tools: "Loops, control structures",
  },
  {
    name: "Task Manager",
    category: "CRUD Application",
    tools: "Create, Read, Update, Delete operations",
  },
  {
    name: "Temperature Converter",
    category: "Utility Application",
    tools: "Temperature conversion logic",
  },
  {
    name: "File-Based Task Storage System",
    category: "Data Management",
    tools: "File handling, persistent data storage",
  },
  {
    name: "Basic Web Scraping Tool",
    category: "Web Scraping",
    tools: "Web scraping libraries, data extraction",
  },
];

const Work = () => {
  const spacerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const boxes = document.querySelectorAll(".work-box");
    if (boxes.length === 0) return;

    const firstBox = boxes[0] as HTMLElement;
    const boxWidth = firstBox.getBoundingClientRect().width;
    const translateX = Math.max(0, boxWidth * boxes.length - window.innerWidth);

    // Instead of relying on GSAP pin to add a spacer (which ScrollSmoother overrides),
    // we inject the exact spacer height directly using a visible div.
    // This guarantees the document has enough vertical space for the horizontal scroll.
    if (spacerRef.current) {
      spacerRef.current.style.height = translateX + "px";
    }

    // Now create a ScrollTrigger that reads scroll position relative to the spacer
    // and moves the work-flex horizontally.
    ScrollTrigger.create({
      trigger: ".work-outer",
      start: "top top",
      end: () => `+=${translateX}`,
      scrub: true,
      pin: ".work-section",
      // pinSpacing: false because we manually handle the scroll space with the work-spacer div.
      // Without this, GSAP adds its own pin spacer ON TOP of our spacer, causing a double-gap.
      pinSpacing: false,
      id: "work",
      onUpdate: (self) => {
        gsap.set(".work-flex", { x: -translateX * self.progress });
      },
    });

    return () => {
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    // work-outer wraps: the sticky work-section + the spacer div.
    // As the user scrolls through the spacer, work-section stays pinned at the top.
    <div className="work-outer" id="work">
      <div className="work-section">
        <div className="work-container section-container">
          <h2>
            My <span>Work</span>
          </h2>
          <div className="work-flex">
            {PROJECTS.map((project, index) => (
              <div className="work-box" key={index}>
                <div className="work-info">
                  <div className="work-title">
                    <h3>0{index + 1}</h3>

                    <div>
                      <h4>{project.name}</h4>
                      <p>{project.category}</p>
                    </div>
                  </div>
                  <h4>Tools and features</h4>
                  <p>{project.tools}</p>
                </div>
                <WorkImage image={project.image || "/images/placeholder.webp"} alt={project.name} link={project.link} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Spacer div: its height is set by JS to match the horizontal scroll distance needed.
          This forces the parent (smooth-content) to have enough height for the pin. */}
      <div ref={spacerRef} className="work-spacer" />
    </div>
  );
};

export default Work;
