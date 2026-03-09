import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import './styles/ParticleTree.css';

const PARTICLE_COUNT = 15000;
const SPARK_COUNT = 2000;
const STAR_COUNT = 7000;
const SNOW_COUNT = 2200;
const LIGHT_COUNT = 1200;

function normalise(points: THREE.Vector3[], size: number): THREE.Vector3[] {
    if (points.length === 0) return [];
    const box = new THREE.Box3().setFromPoints(points);
    const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray()) || 1;
    const centre = box.getCenter(new THREE.Vector3());
    return points.map(p => p.clone().sub(centre).multiplyScalar(size / maxDim));
}

function christmasTreeClassic(n: number) {
    const pts: THREE.Vector3[] = [];
    const layers = 14, baseRadius = 24, height = 72;
    let used = 0;
    for (let L = 0; L < layers && used < n; L++) {
        const t = L / (layers - 1);
        const y = -height / 2 + t * height;
        const radius = baseRadius * (1 - Math.pow(t, 1.6));
        const layerCount = Math.max(1, Math.floor((1 - t * 0.6) * (n / layers)));
        for (let i = 0; i < layerCount && used < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = radius * Math.pow(Math.random(), 0.6);
            pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .4, y + (Math.random() - .5) * .6, Math.sin(a) * r + (Math.random() - .5) * .4));
            used++;
        }
    }
    const trunk = Math.min(220, n - used);
    for (let i = 0; i < trunk && used < n; i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * 1.6, -height / 2 - Math.random() * 6, (Math.random() - .5) * 1.6));
        used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeSparse(n: number) {
    const pts: THREE.Vector3[] = [];
    const rings = 40, height = 78, radius = 22;
    let used = 0;
    for (let r = 0; r < rings && used < n; r++) {
        const t = r / (rings - 1);
        const y = -height / 2 + t * height;
        const ringR = radius * (1 - t);
        const pointsOnRing = Math.max(3, Math.floor(4 + (1 - t) * 40));
        for (let i = 0; i < pointsOnRing && used < n; i++) {
            if (Math.random() < 0.7) {
                const a = (i / pointsOnRing) * Math.PI * 2 + (t * 0.6);
                pts.push(new THREE.Vector3(Math.cos(a) * ringR * (0.9 + Math.random() * 0.2), y + (Math.random() - .5) * .6, Math.sin(a) * ringR * (0.9 + Math.random() * 0.2)));
                used++;
            }
        }
    }
    for (let i = 0; i < Math.min(300, n - used); i++) {
        const a = Math.random() * Math.PI * 2, t = Math.random();
        const y = -height / 2 + t * height, rR = radius * (1 - t);
        pts.push(new THREE.Vector3(Math.cos(a) * rR * (0.98 + Math.random() * 0.04), y + (Math.random() - .5) * .8, Math.sin(a) * rR * (0.98 + Math.random() * 0.04)));
        used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeOrnaments(n: number) {
    const pts: THREE.Vector3[] = [];
    const foliageLayers = 12, baseRadius = 22, height = 72;
    let used = 0;
    for (let L = 0; L < foliageLayers && used < n; L++) {
        const t = L / (foliageLayers - 1);
        const y = -height / 2 + t * height;
        const radius = baseRadius * (1 - t * 0.9);
        const density = Math.floor((1 - t * 0.4) * (n / foliageLayers));
        for (let i = 0; i < density && used < n; i++) {
            const a = Math.random() * Math.PI * 2, r = radius * (0.5 + Math.random() * 0.5);
            pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .7, y + (Math.random() - .5) * .6, Math.sin(a) * r + (Math.random() - .5) * .7));
            used++;
        }
    }
    for (let i = 0; i < Math.min(200, n - used); i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * 1.8, -height / 2 - Math.random() * 5, (Math.random() - .5) * 1.8)); used++;
    }
    for (let i = 0; i < Math.min(800, n - used); i++) {
        const layer = Math.floor(Math.random() * foliageLayers);
        const t = layer / (foliageLayers - 1);
        const y = -height / 2 + t * height + (Math.random() - .5) * .6;
        const radius = baseRadius * (1 - t * 0.9);
        const a = Math.random() * Math.PI * 2, r = radius * (0.6 + Math.random() * 0.4);
        pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .2, y, Math.sin(a) * r + (Math.random() - .5) * .2)); used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeStacked(n: number) {
    const pts: THREE.Vector3[] = [];
    const tiers = 8, baseRadius = 26, totalHeight = 80;
    let used = 0;
    for (let tier = 0; tier < tiers && used < n; tier++) {
        const t = tier / (tiers - 1);
        const y = -totalHeight / 2 + t * totalHeight;
        const radius = baseRadius * (1 - t * 0.95);
        const thickness = 1.6 + Math.random() * 0.8;
        const tierCount = Math.max(1, Math.floor((1 - t * 0.3) * (n / tiers)));
        for (let i = 0; i < tierCount && used < n; i++) {
            const a = Math.random() * Math.PI * 2, r = radius * Math.pow(Math.random(), 0.8);
            pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .3, y + (Math.random() - .5) * thickness, Math.sin(a) * r + (Math.random() - .5) * .3));
            used++;
        }
    }
    for (let i = 0; i < 200 && used < n; i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * 1.8, -totalHeight / 2 - Math.random() * 6, (Math.random() - .5) * 1.8)); used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeSpiral(n: number) {
    const pts: THREE.Vector3[] = [];
    const turns = 6.5, height = 78, baseRadius = 22;
    const spineCount = Math.floor(n * 0.12);
    let used = 0;
    const foliageCount = Math.floor(n * 0.75);
    for (let i = 0; i < foliageCount && used < n; i++) {
        const t = Math.random();
        const y = -height / 2 + t * height;
        const rmax = baseRadius * (1 - t * 0.95);
        const r = rmax * Math.pow(Math.random(), 0.6);
        const a = Math.random() * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .6, y + (Math.random() - .5) * .6, Math.sin(a) * r + (Math.random() - .5) * .6)); used++;
    }
    for (let i = 0; i < spineCount && used < n; i++) {
        const t = i / Math.max(1, spineCount - 1);
        const angle = t * turns * Math.PI * 2;
        const y = -height / 2 + t * height;
        const r = baseRadius * (1 - t) * (0.75 + 0.2 * Math.sin(t * 12));
        pts.push(new THREE.Vector3(Math.cos(angle) * r + (Math.random() - .5) * .15, y + (Math.random() - .5) * .15, Math.sin(angle) * r + (Math.random() - .5) * .15)); used++;
    }
    const topCount = Math.min(160, n - used);
    for (let i = 0; i < topCount && used < n; i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * .8, height / 2 + Math.random() * 1.6, (Math.random() - .5) * .8)); used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeBonsai(n: number) {
    const pts: THREE.Vector3[] = [];
    const layers = 10, baseRadius = 12, height = 28;
    let used = 0;
    for (let L = 0; L < layers && used < n; L++) {
        const t = L / (layers - 1);
        const y = -height / 2 + t * height;
        const radius = baseRadius * (1 - Math.pow(t, 1.8));
        const layerCount = Math.max(1, Math.floor((1 - t * 0.2) * (n / layers)));
        for (let i = 0; i < layerCount && used < n; i++) {
            const a = Math.random() * Math.PI * 2, r = radius * Math.pow(Math.random(), 1.1);
            pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .15, y + (Math.random() - .5) * .2, Math.sin(a) * r + (Math.random() - .5) * .15)); used++;
        }
    }
    for (let i = 0; i < 60 && used < n; i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * .6, -height / 2 - Math.random() * 2, (Math.random() - .5) * .6)); used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeCandy(n: number) {
    const pts: THREE.Vector3[] = [];
    const turns = 8, height = 70, baseRadius = 20;
    let used = 0;
    const spiralCount = Math.floor(n * 0.45);
    for (let i = 0; i < spiralCount && used < n; i++) {
        const t = i / spiralCount;
        const angle = t * turns * Math.PI * 2;
        const y = -height / 2 + t * height + (Math.sin(t * 20) * 0.8);
        const r = baseRadius * (1 - t * 0.95) * (0.7 + 0.15 * Math.sin(t * 12));
        pts.push(new THREE.Vector3(Math.cos(angle) * r + (Math.random() - .5) * .4, y + (Math.random() - .5) * .5, Math.sin(angle) * r + (Math.random() - .5) * .4)); used++;
    }
    const foliage = n - used - 200;
    for (let i = 0; i < foliage && used < n; i++) {
        const t = Math.random(), y = -height / 2 + t * height;
        const rmax = baseRadius * (1 - t * 0.9), r = rmax * Math.pow(Math.random(), 0.7);
        const a = Math.random() * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .6, y + (Math.random() - .5) * .6, Math.sin(a) * r + (Math.random() - .5) * .6)); used++;
    }
    for (let i = 0; i < 200 && used < n; i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * 1.6, -height / 2 - Math.random() * 6, (Math.random() - .5) * 1.6)); used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeFrosted(n: number) {
    const pts: THREE.Vector3[] = [];
    const layers = 16, baseRadius = 24, height = 78;
    let used = 0;
    for (let L = 0; L < layers && used < n; L++) {
        const t = L / (layers - 1);
        const y = -height / 2 + t * height;
        const densityFactor = 1 + Math.pow(t, 2.2) * 2.5;
        const radius = baseRadius * (1 - Math.pow(t, 1.2));
        const layerCount = Math.max(1, Math.floor((n / layers) * densityFactor));
        for (let i = 0; i < layerCount && used < n; i++) {
            const a = Math.random() * Math.PI * 2, r = radius * Math.pow(Math.random(), 0.7);
            pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .5, y + Math.abs((Math.random() - .25)) * .9, Math.sin(a) * r + (Math.random() - .5) * .5)); used++;
        }
    }
    for (let i = 0; i < 160 && used < n; i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * 1.6, -height / 2 - Math.random() * 5, (Math.random() - .5) * 1.6)); used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

function christmasTreeLollipop(n: number) {
    const pts: THREE.Vector3[] = [];
    const blobs = 12, baseRadius = 18, height = 68;
    let used = 0;
    for (let b = 0; b < blobs && used < n; b++) {
        const t = b / (blobs - 1);
        const centerY = -height / 2 + t * height;
        const blobR = baseRadius * (1 - t * 0.85) * (0.6 + Math.random() * 0.6);
        const count = Math.floor((n / blobs) * (0.8 + Math.random() * 0.8));
        for (let i = 0; i < count && used < n; i++) {
            const a = Math.random() * Math.PI * 2, r = blobR * Math.pow(Math.random(), 0.6);
            pts.push(new THREE.Vector3(Math.cos(a) * r + (Math.random() - .5) * .8, centerY + (Math.random() - .5) * .9, Math.sin(a) * r + (Math.random() - .5) * .8)); used++;
        }
    }
    for (let i = 0; i < 140 && used < n; i++) {
        pts.push(new THREE.Vector3((Math.random() - .5) * 1.4, -height / 2 - Math.random() * 5, (Math.random() - .5) * 1.4)); used++;
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)].clone());
    return normalise(pts.slice(0, n), 60);
}

const PATTERNS = [
    christmasTreeClassic, christmasTreeSparse, christmasTreeOrnaments,
    christmasTreeStacked, christmasTreeSpiral, christmasTreeBonsai,
    christmasTreeCandy, christmasTreeFrosted, christmasTreeLollipop
];

const ParticleTree = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const morphBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const containerMaybe = containerRef.current;
        const morphBtnMaybe = morphBtnRef.current;
        if (!containerMaybe || !morphBtnMaybe) return;
        // Non-null aliases — safe to use in nested functions
        const container: HTMLDivElement = containerMaybe;
        const morphBtn: HTMLButtonElement = morphBtnMaybe;

        let scene: THREE.Scene,
            camera: THREE.PerspectiveCamera,
            renderer: THREE.WebGLRenderer,
            composer: EffectComposer,
            controls: OrbitControls;
        let particles: THREE.Points, sparkles: THREE.Points, stars: THREE.Points, snow: THREE.Points, lights: THREE.Points;
        const clock = new THREE.Clock();
        let currentPattern = 1, isTrans = false, prog = 0;
        let morphSpeed = 0.02;
        let animFrameId: number;

        // ----- star system -----
        function createStars() {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(STAR_COUNT * 3);
            const col = new Float32Array(STAR_COUNT * 3);
            const size = new Float32Array(STAR_COUNT);
            const rnd = new Float32Array(STAR_COUNT);
            const R = 900;
            for (let i = 0; i < STAR_COUNT; i++) {
                const i3 = i * 3, θ = Math.random() * 2 * Math.PI, φ = Math.acos(2 * Math.random() - 1), r = R * Math.cbrt(Math.random());
                pos[i3] = r * Math.sin(φ) * Math.cos(θ); pos[i3 + 1] = r * Math.sin(φ) * Math.sin(θ); pos[i3 + 2] = r * Math.cos(φ);
                const c = new THREE.Color().setHSL(Math.random() * .6, .3 + .3 * Math.random(), .55 + .35 * Math.random());
                col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
                size[i] = .25 + Math.pow(Math.random(), 4) * 2.1;
                rnd[i] = Math.random() * Math.PI * 2;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
            geo.setAttribute('random', new THREE.BufferAttribute(rnd, 1));
            const mat = new THREE.ShaderMaterial({
                uniforms: { time: { value: 0 } },
                vertexShader: `attribute float size;attribute float random;varying vec3 vColor;varying float vRnd;void main(){vColor=color;vRnd=random;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*(250./-mv.z);gl_Position=projectionMatrix*mv;}`,
                fragmentShader: `uniform float time;varying vec3 vColor;varying float vRnd;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);float a=1.-smoothstep(.4,.5,d);a*=.7+.3*sin(time*(.6+vRnd*.3)+vRnd*5.);if(a<.02)discard;gl_FragColor=vec4(vColor,a);}`,
                transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending
            });
            return new THREE.Points(geo, mat);
        }

        // ----- particle system -----
        function makeParticles(count: number, palette: THREE.Color[]) {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const col = new Float32Array(count * 3);
            const size = new Float32Array(count);
            const rnd = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const i3 = i * 3, base = palette[Math.random() * palette.length | 0], hsl = { h: 0, s: 0, l: 0 };
                base.getHSL(hsl);
                hsl.h += (Math.random() - .5) * .05;
                hsl.s = Math.min(1, Math.max(.6, hsl.s + (Math.random() - .5) * .25));
                hsl.l = Math.min(.85, Math.max(.48, hsl.l + (Math.random() - .5) * .35 + .02));
                const c = new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
                col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;
                size[i] = .6 + Math.random() * 1.1;
                rnd[i3] = Math.random() * 10; rnd[i3 + 1] = Math.random() * Math.PI * 2; rnd[i3 + 2] = .5 + Math.random() * .6;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
            geo.setAttribute('random', new THREE.BufferAttribute(rnd, 3));
            const mat = new THREE.ShaderMaterial({
                uniforms: { time: { value: 0 }, hueSpeed: { value: .12 } },
                vertexShader: `uniform float time;attribute float size;attribute vec3 random;varying vec3 vCol;varying float vR;varying float vRX;varying float vRY;void main(){vCol=color;vR=random.z;vRX=random.x;vRY=random.y;vec3 p=position;float t=time*.25*random.z;float ax=t+random.y,ay=t*.75+random.x;float amp=(.45+sin(random.x+t*.45)*.2)*random.z;p.x+=sin(ax+p.y*.06+random.x*.1)*amp;p.y+=cos(ay+p.z*.06+random.y*.1)*amp;p.z+=sin(ax*.85+p.x*.06+random.z*.1)*amp;vec4 mv=modelViewMatrix*vec4(p,1.);float pulse=.95+.08*sin(time*1.0+random.y);gl_PointSize=size*pulse*(340./-mv.z);gl_Position=projectionMatrix*mv;}`,
                fragmentShader: `uniform float time;uniform float hueSpeed;varying vec3 vCol;varying float vR;varying float vRX;varying float vRY;vec3 hueShift(vec3 c,float h){const vec3 k=vec3(0.57735);float cosA=cos(h);float sinA=sin(h);return c*cosA+cross(k,c)*sinA+k*dot(k,c)*(1.-cosA);}void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);float core=smoothstep(.07,.0,d);float angle=atan(uv.y,uv.x);float flareSeed=sin(angle*6.+time*1.5*vRY+vRX);float flare=pow(max(0.,flareSeed),5.);flare*=smoothstep(.6,.0,d);float glow=smoothstep(.5,.09,d);float twinkle=.18*(.5+.5*sin(time*3.5*vR+vRX));float alpha=core*(1.+twinkle)+flare*.28+glow*.15;vec3 color=hueShift(vCol,time*hueSpeed);color=color*(1.+.25*vR);vec3 finalColor=mix(color,vec3(1.,.96,.9),core*.6);finalColor=mix(finalColor,color,flare*.45+glow*.45);if(alpha<.01)discard;gl_FragColor=vec4(finalColor,alpha);}`,
                transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending
            });
            return new THREE.Points(geo, mat);
        }

        function createSparkles(count: number) {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const size = new Float32Array(count);
            const rnd = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                size[i] = .35 + Math.random() * .6;
                rnd[i * 3] = Math.random() * 10; rnd[i * 3 + 1] = Math.random() * Math.PI * 2; rnd[i * 3 + 2] = .5 + .5 * Math.random();
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
            geo.setAttribute('random', new THREE.BufferAttribute(rnd, 3));
            const mat = new THREE.ShaderMaterial({
                uniforms: { time: { value: 0 } },
                vertexShader: `uniform float time;attribute float size;attribute vec3 random;void main(){vec3 p=position;float t=time*.2*random.z;float ax=t+random.y,ay=t*.6+random.x;float amp=(.45+sin(random.x+t*.4)*.15)*random.z;p.x+=sin(ax+p.y*.06+random.x*.08)*amp;p.y+=cos(ay+p.z*.06+random.y*.08)*amp;p.z+=sin(ax*.85+p.x*.06+random.z*.08)*amp;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=size*(300./-mv.z);gl_Position=projectionMatrix*mv;}`,
                fragmentShader: `void main(){float d=length(gl_PointCoord-vec2(.5));float alpha=1.-smoothstep(.45,.55,d);if(alpha<.01)discard;gl_FragColor=vec4(1.,1.,1.,alpha*.9);}`,
                transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
            });
            return new THREE.Points(geo, mat);
        }

        function createSnow(count: number) {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const vel = new Float32Array(count);
            const size = new Float32Array(count);
            const seed = new Float32Array(count);
            const spread = 700, height = 500;
            for (let i = 0; i < count; i++) {
                const idx = i * 3;
                pos[idx] = (Math.random() - .5) * spread; pos[idx + 1] = Math.random() * height + 20; pos[idx + 2] = (Math.random() - .5) * spread;
                vel[i] = 10 + Math.random() * 28; size[i] = 1.1 + Math.random() * 2.4; seed[i] = Math.random() * Math.PI * 2;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('vVel', new THREE.BufferAttribute(vel, 1));
            geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
            geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
            const mat = new THREE.ShaderMaterial({
                uniforms: { time: { value: 0 } },
                vertexShader: `uniform float time;attribute float size;attribute float seed;varying float vSeed;void main(){vSeed=seed;vec3 p=position;p.x+=sin(time*.6+seed)*4.;p.z+=cos(time*.45+seed*.7)*4.;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=size*(300./-mv.z);gl_Position=projectionMatrix*mv;}`,
                fragmentShader: `varying float vSeed;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);float alpha=1.-smoothstep(.45,.6,d);alpha*=.8+.2*sin(vSeed*7.);if(alpha<.01)discard;gl_FragColor=vec4(vec3(1.),alpha);}`,
                transparent: true, depthWrite: false, blending: THREE.NormalBlending
            });
            return new THREE.Points(geo, mat);
        }

        function updateSnow(dt: number) {
            if (!snow) return;
            const pos = snow.geometry.attributes.position.array as Float32Array;
            const vel = snow.geometry.attributes.vVel.array as Float32Array;
            const seed = snow.geometry.attributes.seed.array as Float32Array;
            const count = pos.length / 3;
            for (let i = 0; i < count; i++) {
                const idx = i * 3;
                pos[idx + 1] -= vel[i] * dt;
                if (pos[idx + 1] < -220) {
                    pos[idx] = (Math.random() - .5) * 700; pos[idx + 1] = 420 + Math.random() * 180; pos[idx + 2] = (Math.random() - .5) * 700;
                    vel[i] = 10 + Math.random() * 28; seed[i] = Math.random() * Math.PI * 2;
                }
            }
            snow.geometry.attributes.position.needsUpdate = true;
        }

        function createLights(count: number, palette: THREE.Color[]) {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const col = new Float32Array(count * 3);
            const size = new Float32Array(count);
            const rnd = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const idx = i * 3;
                pos[idx] = 0; pos[idx + 1] = 0; pos[idx + 2] = 0;
                const c = palette[Math.floor(Math.random() * palette.length)].clone();
                c.offsetHSL(0, 0, .06);
                col[idx] = c.r; col[idx + 1] = c.g; col[idx + 2] = c.b;
                size[i] = 1. + Math.random() * 1.6;
                rnd[idx] = Math.random() * Math.PI * 2; rnd[idx + 1] = .4 + Math.random() * 1.; rnd[idx + 2] = .45 + Math.random() * .6;
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
            geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
            geo.setAttribute('rnd', new THREE.BufferAttribute(rnd, 3));
            const mat = new THREE.ShaderMaterial({
                uniforms: { time: { value: 0 }, hueSpeed: { value: .35 } },
                vertexShader: `uniform float time;attribute float size;attribute vec3 rnd;varying float vIntensity;varying vec3 vColor;void main(){vIntensity=rnd.z;vColor=color;vec3 p=position;float t=time*(.4+rnd.y*.25);float orbit=.12*rnd.y;p.x+=cos(t+rnd.x)*orbit*(.6+sin(t*.6)*.15);p.z+=sin(t*.7+rnd.x*.4)*orbit*(.6+cos(t*.5)*.15);p.y+=sin(t*(.7+rnd.y*.15)+rnd.x)*.35*(.5+rnd.y*.4);vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=size*(420./-mv.z)*.9;gl_Position=projectionMatrix*mv;}`,
                fragmentShader: `uniform float time;uniform float hueSpeed;varying float vIntensity;varying vec3 vColor;vec3 hueShift(vec3 c,float h){const vec3 k=vec3(0.57735);float cosA=cos(h);float sinA=sin(h);return c*cosA+cross(k,c)*sinA+k*dot(k,c)*(1.-cosA);}void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);float core=smoothstep(.28,.0,d);float glow=smoothstep(.6,.2,d);float tw=.6+.4*sin(time*(3.+vIntensity*2.)+vIntensity*3.);float alpha=(core*(.6+.35*vIntensity)+glow*.18)*(tw*.9);if(alpha<.01)discard;vec3 c=hueShift(vColor,time*.25*(.2+vIntensity*.3));vec3 final=mix(c,vec3(1.,.95,.9),core*.6);final*=1.+.35*vIntensity;gl_FragColor=vec4(final,alpha*.95);}`,
                transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending
            });
            return new THREE.Points(geo, mat);
        }

        function placeLightsOnPattern(pts: THREE.Vector3[], lightsGeo: THREE.BufferGeometry) {
            const lpos = lightsGeo.attributes.position.array as Float32Array;
            const lsize = lightsGeo.attributes.size.array as Float32Array;
            const cnt = Math.min(LIGHT_COUNT, lpos.length / 3);
            const n = pts.length;
            for (let i = 0; i < cnt; i++) {
                const idxPt = Math.floor(Math.pow(Math.random(), .8) * n);
                const p = pts[idxPt % n] || new THREE.Vector3();
                const j = i * 3, outward = .5 + Math.random() * .9, a = Math.random() * Math.PI * 2;
                lpos[j] = p.x + Math.cos(a) * outward * (.5 + Math.random() * .5);
                lpos[j + 1] = p.y + (Math.random() - .5) * .6;
                lpos[j + 2] = p.z + Math.sin(a) * outward * (.5 + Math.random() * .5);
                lsize[i] = 1. + Math.random() * 1.4;
            }
            lightsGeo.attributes.position.needsUpdate = true;
            lightsGeo.attributes.size.needsUpdate = true;
        }

        function seedParticlesRandomly() {
            const pos = particles.geometry.attributes.position.array as Float32Array;
            const sPos = sparkles.geometry.attributes.position.array as Float32Array;
            const R = 120;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const idx = i * 3, r = R * Math.cbrt(Math.random());
                const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1);
                pos[idx] = r * Math.sin(phi) * Math.cos(theta) + (Math.random() - .5) * 6;
                pos[idx + 1] = r * Math.cos(phi) * .6 + (Math.random() - .5) * 10;
                pos[idx + 2] = r * Math.sin(phi) * Math.sin(theta) + (Math.random() - .5) * 6;
                if (i < SPARK_COUNT) { sPos[idx] = pos[idx] + (Math.random() - .5) * 1.4; sPos[idx + 1] = pos[idx + 1] + (Math.random() - .5) * 1.4; sPos[idx + 2] = pos[idx + 2] + (Math.random() - .5) * 1.4; }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            sparkles.geometry.attributes.position.needsUpdate = true;
            const lpos = lights.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < Math.min(LIGHT_COUNT, lpos.length / 3); i++) {
                const j = i * 3; lpos[j] = (Math.random() - .5) * 180; lpos[j + 1] = (Math.random() - .2) * 80; lpos[j + 2] = (Math.random() - .5) * 180;
            }
            lights.geometry.attributes.position.needsUpdate = true;
        }

        function morphToPattern(i: number, options: { initial?: boolean } = {}) {
            const targetPts = PATTERNS[i](PARTICLE_COUNT);
            const to = new Float32Array(PARTICLE_COUNT * 3);
            for (let j = 0; j < PARTICLE_COUNT; j++) {
                const idx = j * 3, p = targetPts[j] || new THREE.Vector3();
                to[idx] = p.x; to[idx + 1] = p.y; to[idx + 2] = p.z;
            }
            const fromPts = (particles.geometry.attributes.position.array as Float32Array).slice();
            (particles as any).userData = { from: fromPts, to, next: i };
            const sparkFrom = (sparkles.geometry.attributes.position.array as Float32Array).slice();
            (sparkles as any).userData = { from: sparkFrom, to, next: i };
            const lightTargets = new Float32Array(LIGHT_COUNT * 3);
            for (let k = 0; k < LIGHT_COUNT; k++) {
                const idx = k * 3, n = targetPts.length, sampleIndex = Math.floor(Math.pow(Math.random(), .8) * n) % n;
                const p = targetPts[sampleIndex], a = Math.random() * Math.PI * 2, outward = .5 + Math.random() * .9;
                lightTargets[idx] = p.x + Math.cos(a) * outward * (.5 + Math.random() * .5);
                lightTargets[idx + 1] = p.y + (Math.random() - .5) * .6;
                lightTargets[idx + 2] = p.z + Math.sin(a) * outward * (.5 + Math.random() * .5);
            }
            (lights as any).userData = { from: (lights.geometry.attributes.position.array as Float32Array).slice(), to: lightTargets, _prog: 0 };
            isTrans = true; prog = 0;
            if (options.initial) { morphSpeed = 0.012; setTimeout(() => { morphSpeed = 0.02; }, 6000); }
        }

        function beginMorph() {
            const next = (currentPattern + 1) % PATTERNS.length;
            const fromPts = (particles.geometry.attributes.position.array as Float32Array).slice();
            const toPts = PATTERNS[next](PARTICLE_COUNT);
            const to = new Float32Array(PARTICLE_COUNT * 3);
            for (let j = 0; j < PARTICLE_COUNT; j++) {
                const idx = j * 3, p = toPts[j] || new THREE.Vector3();
                to[idx] = p.x; to[idx + 1] = p.y; to[idx + 2] = p.z;
            }
            (particles as any).userData = { from: fromPts, to, next };
            (sparkles as any).userData = { from: fromPts, to, next };
            const lightTargets = new Float32Array(LIGHT_COUNT * 3);
            for (let i = 0; i < LIGHT_COUNT; i++) {
                const idx = i * 3, n = toPts.length, sampleIndex = Math.floor(Math.pow(Math.random(), .8) * n) % n;
                const p = toPts[sampleIndex], a = Math.random() * Math.PI * 2, outward = .5 + Math.random() * .9;
                lightTargets[idx] = p.x + Math.cos(a) * outward * (.5 + Math.random() * .5);
                lightTargets[idx + 1] = p.y + (Math.random() - .5) * .6;
                lightTargets[idx + 2] = p.z + Math.sin(a) * outward * (.5 + Math.random() * .5);
            }
            (lights as any).userData = { from: (lights.geometry.attributes.position.array as Float32Array).slice(), to: lightTargets, _prog: 0 };
            isTrans = true; prog = 0;
        }

        function init() {
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x050203, .012);
            camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, .1, 4000);
            camera.position.set(0, 0, 80);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true; controls.dampingFactor = .05;
            controls.screenSpacePanning = false; controls.minDistance = 20; controls.maxDistance = 200;
            controls.target.set(0, 0, 0); controls.autoRotate = true; controls.autoRotateSpeed = .45;

            stars = createStars();
            scene.add(stars);

            const palette = [0x0b6623, 0x1fa12f, 0x2ecc71, 0xffd700, 0xff4500, 0xffffff, 0xff0055, 0xffaa00].map(c => new THREE.Color(c));
            particles = makeParticles(PARTICLE_COUNT, palette);
            sparkles = createSparkles(SPARK_COUNT);
            scene.add(particles); scene.add(sparkles);
            lights = createLights(LIGHT_COUNT, palette);
            scene.add(lights);
            snow = createSnow(SNOW_COUNT);
            scene.add(snow);

            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            composer.addPass(new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), .6, .7, .6));
            const after = new AfterimagePass();
            (after as any).uniforms.damp.value = .92;
            composer.addPass(after);
            composer.addPass(new OutputPass());

            seedParticlesRandomly();
            morphToPattern(currentPattern, { initial: true });

            const onResize = () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
                composer.setSize(container.clientWidth, container.clientHeight);
            };
            window.addEventListener('resize', onResize);

            morphBtn!.addEventListener('click', () => { if (!isTrans) beginMorph(); });

            // cleanup stored for dispose
            (container as any)._cleanupResize = onResize;
        }

        function animate() {
            animFrameId = requestAnimationFrame(animate);
            const dt = clock.getDelta(), t = clock.getElapsedTime();
            controls.update();
            (particles.material as THREE.ShaderMaterial).uniforms.time.value = t;
            (sparkles.material as THREE.ShaderMaterial).uniforms.time.value = t;
            (lights.material as THREE.ShaderMaterial).uniforms.time.value = t;
            (snow.material as THREE.ShaderMaterial).uniforms.time.value = t;
            updateSnow(dt);

            if (isTrans && (lights as any).userData) {
                const lu = (lights as any).userData;
                lu._prog = (lu._prog || 0) + morphSpeed;
                const lp = Math.min(1, lu._prog), eased = lp >= 1 ? 1 : 1 - Math.pow(1 - lp, 3);
                const lpos = lights.geometry.attributes.position.array as Float32Array;
                const len = Math.min(lpos.length, lu.to.length);
                for (let i = 0; i < len; i++) lpos[i] = lu.from[i] + (lu.to[i] - lu.from[i]) * eased;
                lights.geometry.attributes.position.needsUpdate = true;
            }

            if (isTrans && (particles as any).userData) {
                prog += morphSpeed;
                const eased = prog >= 1 ? 1 : 1 - Math.pow(1 - prog, 3);
                const { from, to } = (particles as any).userData;
                if (to) {
                    const particleArr = particles.geometry.attributes.position.array as Float32Array;
                    const sparkleArr = sparkles.geometry.attributes.position.array as Float32Array;
                    for (let i = 0; i < particleArr.length; i++) {
                        const val = from[i] + (to[i] - from[i]) * eased;
                        particleArr[i] = val;
                        if (i < sparkleArr.length) sparkleArr[i] = val;
                    }
                    particles.geometry.attributes.position.needsUpdate = true;
                    sparkles.geometry.attributes.position.needsUpdate = true;
                }
                if (prog >= 1) {
                    currentPattern = (particles as any).userData.next;
                    isTrans = false;
                    const finalPts = PATTERNS[currentPattern](PARTICLE_COUNT);
                    placeLightsOnPattern(finalPts, lights.geometry);
                    (lights as any).userData = null;
                }
            }
            composer.render(dt);
        }

        init();
        animate();

        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('resize', (container as any)._cleanupResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <section className="particle-tree-section">
            <div ref={containerRef} className="particle-tree-container" />
            <div className="particle-tree-vignette" />
            <div className="particle-tree-instructions">Drag to explore — particles will slowly reorganize into each tree.</div>
            <button ref={morphBtnRef} className="particle-tree-morph-btn">Morph Shape</button>
        </section>
    );
};

export default ParticleTree;
