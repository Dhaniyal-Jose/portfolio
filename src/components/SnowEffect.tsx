import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './styles/SnowEffect.css';

const SnowEffect = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;

        // Use a local arr so it doesn't conflict across hot reloads
        const arr: any[] = [];
        const ctx = c.getContext('2d');
        if (!ctx) return;

        const cw = (c.width = 3000);
        const ch = (c.height = 3000);
        const c2 = c.cloneNode(true) as HTMLCanvasElement;
        const ctx2 = c2.getContext('2d', { willReadFrequently: true });
        if (!ctx2) return;

        // No text image — snowflakes fall freely without accumulating
        for (let i = 0; i < 1300; i++) makeFlake(i, true);

        function makeFlake(i: number, ff: boolean) {
            arr.push({ i: i, x: 0, x2: 0, y: 0, s: 0 });
            arr[i].t = gsap.timeline({ repeat: -1, repeatRefresh: true })
                .fromTo(
                    arr[i],
                    {
                        x: () => -400 + (cw + 800) * Math.random(),
                        y: -15,
                        s: () => 'random(1.8, 7, .1)',
                        x2: -500,
                    },
                    {
                        ease: 'none',
                        y: ch,
                        x: '+=' + 'random(-400, 400, 1)',
                        x2: 500,
                    }
                )
                .seek(ff ? Math.random() * 99 : 0)
                .timeScale(arr[i].s / 37);
        }

        ctx.fillStyle = '#fff';

        function render() {
            if (!ctx || !ctx2) return;
            ctx.clearRect(0, 0, cw, ch);
            arr.forEach((flake) => {
                if (flake.t) {
                    if (flake.t.isActive()) {
                        const d = ctx2.getImageData(flake.x + flake.x2, flake.y, 1, 1);
                        if (d.data[3] > 150 && Math.random() > 0.5) {
                            flake.t.pause();
                            if (arr.length < 9000) makeFlake(arr.length - 1, false);
                        }
                    }
                }
                ctx.beginPath();
                const yRatio = flake.y / ch;
                const interpolator = gsap.utils.interpolate(1, 0.2, yRatio);
                ctx.arc(
                    flake.x + flake.x2,
                    flake.y,
                    flake.s * (typeof interpolator === 'number' ? interpolator : 1),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            });
        }

        gsap.ticker.add(render);

        return () => {
            gsap.ticker.remove(render);
            arr.forEach((flake) => {
                if (flake.t) {
                    flake.t.kill();
                }
            });
        };
    }, []);

    return (
        <div className="snow-fixed-wrapper">
            <canvas ref={canvasRef} className="snow-canvas" />
        </div>
    );
};

export default SnowEffect;
