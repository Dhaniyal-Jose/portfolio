import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./styles/Certifications.css";
interface Certificate {
    id: number;
    label: string;
    image: string;
}

const certificates: Certificate[] = [
    { id: 1, label: "Web Development Internship", image: "/certificates/keltron internship_page-0001.jpg" },
    { id: 2, label: "Mobile App Development", image: "/certificates/Dhaniyal Jose.jpg" },
    { id: 3, label: "Software Developer Intern", image: "/certificates/Dhaniyal Jose (2)_page-0001.jpg" },
    { id: 4, label: "UI/UX Workshop", image: "/certificates/UI_UX workshop_page-0001.jpg" },
    { id: 5, label: "Robotics Workshop", image: "/certificates/Robotics workshop_page-0001.jpg" },
    { id: 6, label: "Blockchain Foundation", image: "/certificates/blockchain-foundation-program_page-0001.jpg" },
    { id: 7, label: "Cyber Talk", image: "/certificates/Cyber talk_page-0001.jpg" },
    { id: 8, label: "Confluence 2024", image: "/certificates/Confluence 2024_page-0001.jpg" },
    { id: 9, label: "Conference Presenter", image: "/certificates/Conference_Certificate_Presenter__Copy_ (1) (1)-31-35-5_page-0001.jpg" },
    { id: 10, label: "Startup Bootcamp", image: "/certificates/startup bootcamp (1)_page-0001.jpg" },
    { id: 11, label: "MuLearn Typing Challenge", image: "/certificates/Mu learn typing challenge _page-0001.jpg" },
    { id: 12, label: "ISTE Certificate", image: "/certificates/Iste certificate1_page-0001.jpg" },
    { id: 13, label: "IEI Membership", image: "/certificates/IEI Membership STIST _page-0001.jpg" },
    { id: 14, label: "NSS Beach Cleaning", image: "/certificates/NSS beach cleaning.png_page-0001.jpg" },
    { id: 15, label: "Web Clone", image: "/certificates/Web clone.JPG" },
    { id: 16, label: "Certificate", image: "/certificates/DHANIYAL JOSE (3)_page-0001.jpg" },
    { id: 17, label: "Achievement Certificate", image: "/certificates/Dhaniyal jose Certificate_page-0001.jpg" },
    { id: 18, label: "Certificate", image: "/certificates/Dhaniyal Jose.pdf_page-0001.jpg" },
    { id: 19, label: "Certificate", image: "/certificates/Dhaniyal Jose.pdf 2_page-0001.jpg" },
    { id: 20, label: "LUEBWAIMAY Certificate", image: "/certificates/LUEBWAIMAY1251004_page-0001.jpg" },
    { id: 21, label: "Certificate", image: "/certificates/Adobe Scan Feb 5, 2026_page-0001.jpg" },
    { id: 22, label: "Certificate", image: "/certificates/Adobe Scan Feb 5, 2026 (1)_page-0001 (1).jpg" },
    { id: 23, label: "Certificate", image: "/certificates/Adobe Scan Feb 5, 2026 (2)_page-0001.jpg" },
    { id: 24, label: "Certificate", image: "/certificates/Adobe Scan Feb 5, 2026 (3)_page-0001.jpg" },
    { id: 25, label: "Certificate (Page 1)", image: "/certificates/Adobe Scan Feb 5, 2026 (4)_page-0001.jpg" },
    { id: 26, label: "Certificate (Page 2)", image: "/certificates/Adobe Scan Feb 5, 2026 (4)_page-0002.jpg" },
    { id: 27, label: "Certificate (Page 3)", image: "/certificates/Adobe Scan Feb 5, 2026 (4)_page-0003.jpg" },
    { id: 28, label: "Certificate (Page 4)", image: "/certificates/Adobe Scan Feb 5, 2026 (4)_page-0004.jpg" },
    { id: 29, label: "Certificate (Page 5)", image: "/certificates/Adobe Scan Feb 5, 2026 (4)_page-0005.jpg" },
    { id: 30, label: "Certificate (Page 6)", image: "/certificates/Adobe Scan Feb 5, 2026 (4)_page-0006.jpg" },
    { id: 31, label: "Photo", image: "/certificates/IMG_7057.JPG" },
    { id: 32, label: "IEDC Student Lead Recognition (2025–26)", image: "/certificates/IEDC-CEO-STIST.jpg" },
];

const TOTAL = certificates.length;
const ANGLE_STEP = 360 / TOTAL;
const SPEED = 0.009;

const Certifications = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const angleRef = useRef(0);
    const [paused, setPaused] = useState(false);
    const [selected, setSelected] = useState<Certificate | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [inView, setInView] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [stepVersion, setStepVersion] = useState(0);
    const closeRef = useRef<HTMLButtonElement>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const hoverRef = useRef(false);
    const focusRef = useRef(false);

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener("change", update);
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
        if (sceneRef.current) observer.observe(sceneRef.current);
        return () => { observer.disconnect(); media.removeEventListener("change", update); };
    }, []);

    useEffect(() => {
        let frame = 0;
        let lastTime = 0;
        let lastPaint = 0;
        let currentIndex = -1;
        const paint = () => {
            const width = sceneRef.current?.clientWidth ?? 900;
            const radius = Math.min(640, Math.max(240, width * 0.7));
            cardsRef.current.forEach((card, index) => {
                if (!card) return;
                const raw = (index * ANGLE_STEP - angleRef.current + 720) % 360;
                const norm = raw > 180 ? raw - 360 : raw;
                const distance = Math.abs(norm);
                const visible = distance < 85;
                card.style.visibility = visible ? "visible" : "hidden";
                card.tabIndex = distance < ANGLE_STEP / 2 ? 0 : -1;
                if (!visible) return;
                const radians = norm * Math.PI / 180;
                const prominence = Math.max(0, 1 - distance / 85);
                const x = Math.sin(radians) * radius;
                const z = (Math.cos(radians) - 1) * radius;
                card.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${norm}deg) scale(${0.72 + prominence * 0.28})`;
                card.style.opacity = `${0.12 + prominence * 0.88}`;
                card.style.zIndex = `${Math.round(100 - distance)}`;
                card.classList.toggle("cert-card--front", distance < ANGLE_STEP / 2);
            });
            const index = Math.round(angleRef.current / ANGLE_STEP) % TOTAL;
            if (index !== currentIndex) { currentIndex = index; setActiveIndex(index); }
        };
        const tick = (time: number) => {
            const delta = lastTime ? Math.min(time - lastTime, 48) : 0;
            lastTime = time;
            if (!document.hidden && !hoverRef.current && !focusRef.current) {
                angleRef.current = (angleRef.current + delta * SPEED) % 360;
                if (time - lastPaint >= 30) { paint(); lastPaint = time; }
            }
            frame = requestAnimationFrame(tick);
        };
        paint();
        if (inView && !paused && !selected && !reducedMotion) frame = requestAnimationFrame(tick);
        window.addEventListener("resize", paint);
        return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", paint); };
    }, [inView, paused, selected, reducedMotion, stepVersion]);

    useEffect(() => {
        if (!selected) return;
        openerRef.current = document.activeElement as HTMLElement;
        closeRef.current?.focus();
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") setSelected(null);
            if (event.key === "Tab") { event.preventDefault(); closeRef.current?.focus(); }
        };
        window.addEventListener("keydown", handler);
        return () => { window.removeEventListener("keydown", handler); openerRef.current?.focus(); };
    }, [selected]);

    const step = (direction: number) => {
        setPaused(true);
        const next = (Math.round(angleRef.current / ANGLE_STEP) + direction + TOTAL) % TOTAL;
        angleRef.current = next * ANGLE_STEP;
        setStepVersion((value) => value + 1);
    };

    return (
        <section id="certifications" className="cert-section section-container" aria-labelledby="cert-title">
            <div className="cert-header">
                <span className="cert-eyebrow">LEARNING. BUILDING. GROWING.</span>
                <h2 id="cert-title">My <span>certifications</span></h2>
                <p>A collection of milestones along the way.</p>
            </div>
            <div className="cert-stage">
                <div className="cert-orbit" aria-hidden="true" />
                <div ref={sceneRef} className="cert-scene" onPointerEnter={(event) => { if (event.pointerType === "mouse") hoverRef.current = true; }} onPointerLeave={() => { hoverRef.current = false; }} onFocusCapture={() => { focusRef.current = true; }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) focusRef.current = false; }}>
                    {certificates.map((cert, index) => (
                        <button key={cert.id} type="button" ref={(element) => { cardsRef.current[index] = element; }} className="cert-card" onClick={() => setSelected(cert)} aria-label={`View ${cert.label}`}>
                            <img src={cert.image} alt={cert.label} loading="lazy" decoding="async" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="cert-caption">
                <span>{String(activeIndex + 1).padStart(2, "0")} / {TOTAL}</span>
                <p>{certificates[activeIndex].label}</p>
            </div>
            <div className="cert-controls">
                <button type="button" onClick={() => step(-1)} aria-label="Previous certificate">←</button>
                <button type="button" onClick={() => setPaused(!paused)} disabled={reducedMotion} aria-label={paused ? "Play certificate rotation" : "Pause certificate rotation"}>{paused || reducedMotion ? "Play" : "Pause"}</button>
                <button type="button" onClick={() => step(1)} aria-label="Next certificate">→</button>
            </div>
            <p className="cert-hint">Select a certificate to take a closer look</p>
            {selected && createPortal(
                <div className="cert-lightbox-overlay" data-lenis-prevent onClick={() => setSelected(null)}>
                    <div className="cert-lightbox-content" role="dialog" aria-modal="true" aria-label={selected.label} onClick={(event) => event.stopPropagation()}>
                        <button ref={closeRef} className="cert-lightbox-close" onClick={() => setSelected(null)} aria-label="Close certificate">×</button>
                        <img src={selected.image} alt={selected.label} />
                        <p className="cert-lightbox-label">{selected.label}</p>
                    </div>
                </div>, document.body
            )}
        </section>
    );
};
export default Certifications;
