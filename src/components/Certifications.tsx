import { useState, useEffect, useRef, useCallback } from "react";
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
];

const TOTAL = certificates.length;
const ANGLE_STEP = 360 / TOTAL;   // ~11.6° between cards
const RADIUS = 350;            // px — compact radius so cards don't touch screen edges
const SPEED = 0.016;          // degrees per millisecond

// Smooth easing: map angular distance [0, 180] → [0, 1]
function frontness(abs: number): number {
    // 1 at 0° (front), 0 at 90°+
    return Math.max(0, 1 - abs / 80);
}

const Certifications = () => {
    const angleRef = useRef(0);
    const rafRef = useRef<number>(0);
    const lastTs = useRef<number | null>(null);
    const [angle, setAngle] = useState(0);
    const [paused, setPaused] = useState(false);
    const [selected, setSelected] = useState<Certificate | null>(null);

    const tick = useCallback((ts: number) => {
        if (lastTs.current === null) lastTs.current = ts;
        const dt = ts - lastTs.current;
        lastTs.current = ts;
        angleRef.current = (angleRef.current + dt * SPEED) % 360;
        setAngle(angleRef.current);
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        if (!paused) {
            lastTs.current = null;
            rafRef.current = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(rafRef.current);
        }
        return () => cancelAnimationFrame(rafRef.current);
    }, [paused, tick]);

    // Close lightbox on Escape key
    useEffect(() => {
        if (!selected) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selected]);

    return (
        <div className="cert-section section-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="cert-header">
                <h2>My <span>certifications</span></h2>
                <p>Hover to pause · Click the front card to view</p>
            </div>

            {/* 3D scene — cards sit directly here, positioned by JS transforms */}
            <div
                className="cert-scene"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {certificates.map((cert, index) => {
                    // Angular position in the cylinder relative to the front (0°)
                    const raw = (index * ANGLE_STEP - angle + 720) % 360;
                    const norm = raw > 180 ? raw - 360 : raw;   // –180 … +180
                    const abs = Math.abs(norm);

                    const f = frontness(abs);             // 0–1, 1 = fully front
                    const scale = 0.38 + f * 0.82;           // 0.38 (shelf) → 1.2 (front)
                    const opacity = 0.06 + f * 0.94;           // nearly invisible in back → fully visible
                    const blur = (1 - f) * 6;               // 6px blur on shelf, sharp at front
                    const zIdx = Math.round(100 - abs);

                    const isFront = abs < 22;

                    return (
                        <div
                            key={cert.id}
                            className={`cert-card${isFront ? " cert-card--front" : ""}`}
                            style={{
                                transform: `rotateY(${norm}deg) translateZ(${RADIUS}px) scale(${scale})`,
                                opacity,
                                filter: blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none",
                                zIndex: zIdx,
                                cursor: isFront ? "pointer" : "default",
                                pointerEvents: isFront ? "auto" : "none",
                            }}
                            onClick={() => isFront && setSelected(cert)}
                            title={isFront ? cert.label : ""}
                        >
                            <img src={cert.image} alt={cert.label} loading="lazy" />
                            {isFront && (
                                <div className="cert-card-label">{cert.label}</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Lightbox */}
            {selected && (
                <div
                    className="cert-lightbox-overlay"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="cert-lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="cert-lightbox-close"
                            onClick={() => setSelected(null)}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        <img src={selected.image} alt={selected.label} />
                        <p className="cert-lightbox-label">{selected.label}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certifications;
