/**
 * Aether Flow - WebGL Shader Animation
 * Ported to Vanilla JS from React component
 */

// Default configuration based on user request/demo
const CONFIG = {
    hue: 200, // SecuRock Blue range (approx)
    speed: 0.15,
    intensity: 0.7,
    complexity: 6.0,
    warp: 0.4
};

class AetherFlow {
    constructor(mountId) {
        this.mount = document.getElementById(mountId);
        if (!this.mount) {
            console.error(`AetherFlow: Mount point #${mountId} not found.`);
            return;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.material = null;
        this.mesh = null;
        this.animationFrameId = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        // Scene Setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true // Allow blending if needed
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
        this.mount.appendChild(this.renderer.domElement);

        // Uniforms
        this.uniforms = {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(this.mount.clientWidth, this.mount.clientHeight) },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_hue: { value: CONFIG.hue },
            u_speed: { value: CONFIG.speed },
            u_intensity: { value: CONFIG.intensity },
            u_complexity: { value: CONFIG.complexity },
            u_warp: { value: CONFIG.warp },
        };

        // Shaders
        const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_hue;
            uniform float u_speed;
            uniform float u_intensity;
            uniform float u_complexity;
            uniform float u_warp;

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                           mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
            }

            float fbm(vec2 st) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 10; i++) {
                    if (i >= int(u_complexity)) break;
                    value += amplitude * noise(st);
                    st *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }

            mat2 rotate(float angle) {
                return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                float t = u_time * u_speed;
                
                vec2 mouse_uv = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                float warp_effect = smoothstep(0.7, 0.0, distance(uv, mouse_uv)) * u_warp;

                vec2 p = uv * rotate(t * 0.1) + warp_effect;
                
                float n1 = fbm(p * 1.2 + vec2(t * 0.1, t * 0.2));
                float n2 = fbm(p * 2.0 + n1 + vec2(-t * 0.25, t * 0.15));
                float n3 = fbm(p * 3.5 + n2 + vec2(t * 0.1, -t * 0.2));

                float final_noise = n1 * 0.6 + n2 * 0.25 + n3 * 0.15;

                float hue_shift = final_noise * 0.1;
                float saturation = 0.6 + final_noise * 0.4;
                float value = 0.15 + pow(final_noise, 2.5) * u_intensity;
                
                value += pow(smoothstep(0.7, 1.0, final_noise), 3.0) * 0.7 * u_intensity;

                vec3 color = hsv2rgb(vec3((u_hue / 360.0) + hue_shift, saturation, value));
                
                color *= 1.0 - smoothstep(0.8, 1.5, length(uv));

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
            transparent: true
        });

        // Mesh
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        // Event Listeners
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Start Loop
        this.animate();
    }

    handleResize() {
        if (!this.mount) return;
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize(width, height);
        this.uniforms.u_resolution.value.set(width, height);
    }

    handleMouseMove(e) {
        // Optional: Scale interaction based on resolution
        this.uniforms.u_mouse.value.x = e.clientX;
        this.uniforms.u_mouse.value.y = window.innerHeight - e.clientY;
    }

    animate() {
        this.uniforms.u_time.value = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    // Public API to update params dynamically
    updateParams(params) {
        if (params.hue !== undefined) this.uniforms.u_hue.value = params.hue;
        if (params.speed !== undefined) this.uniforms.u_speed.value = params.speed;
    }
}

// Global initialization helper
window.initAetherFlow = (mountId) => {
    return new AetherFlow(mountId);
};
