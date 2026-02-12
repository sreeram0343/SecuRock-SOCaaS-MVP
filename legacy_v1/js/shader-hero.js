/**
 * WebGL Shader Background
 * Ported from React to Vanilla JS
 */

const defaultShaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
// Returns a pseudo random number for a given point (white noise)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
// Returns a pseudo random number for a given point (value noise)
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
// Returns a pseudo random number for a given point (fractal noise)
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
	}
	O=vec4(col,1);
}`;

class WebGLRenderer {
    constructor(canvas, scale) {
        this.canvas = canvas;
        this.scale = scale;
        this.gl = canvas.getContext('webgl2');
        this.gl.viewport(0, 0, canvas.width, canvas.height); // viewport uses pixel dimensions
        this.shaderSource = defaultShaderSource;
        this.mouseMove = [0, 0];
        this.mouseCoords = [0, 0];
        this.pointerCoords = [0, 0];
        this.nbrOfPointers = 0;
        this.vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
        this.vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
        this.program = null;
    }

    updateShader(source) {
        this.reset();
        this.shaderSource = source;
        this.setup();
        this.init();
    }

    updateMove(deltas) {
        this.mouseMove = deltas;
    }

    updateMouse(coords) {
        this.mouseCoords = coords;
    }

    updatePointerCoords(coords) {
        this.pointerCoords = coords;
    }

    updatePointerCount(nbr) {
        this.nbrOfPointers = nbr;
    }

    updateScale(scale) {
        this.scale = scale;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    compile(shader, source) {
        const gl = this.gl;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        }
    }

    reset() {
        const gl = this.gl;
        if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
            if (this.vs) {
                gl.detachShader(this.program, this.vs);
                gl.deleteShader(this.vs);
            }
            if (this.fs) {
                gl.detachShader(this.program, this.fs);
                gl.deleteShader(this.fs);
            }
            gl.deleteProgram(this.program);
        }
    }

    setup() {
        const gl = this.gl;
        this.vs = gl.createShader(gl.VERTEX_SHADER);
        this.fs = gl.createShader(gl.FRAGMENT_SHADER);
        this.compile(this.vs, this.vertexSrc);
        this.compile(this.fs, this.shaderSource);
        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vs);
        gl.attachShader(this.program, this.fs);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.program));
        }
    }

    init() {
        const gl = this.gl;
        const program = this.program;
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        program.resolution = gl.getUniformLocation(program, 'resolution');
        program.time = gl.getUniformLocation(program, 'time');
        program.move = gl.getUniformLocation(program, 'move');
        program.touch = gl.getUniformLocation(program, 'touch');
        program.pointerCount = gl.getUniformLocation(program, 'pointerCount');
        program.pointers = gl.getUniformLocation(program, 'pointers');
    }

    render(now = 0) {
        const gl = this.gl;
        const program = this.program;
        if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(program.time, now * 1e-3);
        gl.uniform2f(program.move, ...this.mouseMove);
        gl.uniform2f(program.touch, ...this.mouseCoords);
        gl.uniform1i(program.pointerCount, this.nbrOfPointers);
        gl.uniform2fv(program.pointers, this.pointerCoords);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

class PointerHandler {
    constructor(element, scale) {
        this.scale = scale;
        this.active = false;
        this.pointers = new Map();
        this.lastCoords = [0, 0];
        this.moves = [0, 0];
        this.element = element;

        const map = (element, scale, x, y) => {
            const rect = element.getBoundingClientRect();
            // Map coordinates relative to canvas
            return [(x - rect.left) * scale, element.height - (y - rect.top) * scale];
        };

        element.addEventListener('pointerdown', (e) => {
            this.active = true;
            this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
        });
        element.addEventListener('pointerup', (e) => {
            if (this.count === 1) this.lastCoords = this.first;
            this.pointers.delete(e.pointerId);
            this.active = this.pointers.size > 0;
        });
        element.addEventListener('pointerleave', (e) => {
            if (this.count === 1) this.lastCoords = this.first;
            this.pointers.delete(e.pointerId);
            this.active = this.pointers.size > 0;
        });
        element.addEventListener('pointermove', (e) => {
            // Track mouse even if not clicking for shader interaction
            this.lastCoords = [e.clientX, e.clientY];
            if (this.active) {
                this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY));
            } else {
                // Update pseudo pointer for hover effect
                this.pointers.set(-1, map(element, this.getScale(), e.clientX, e.clientY));
            }
            this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
        });
    }

    getScale() {
        return this.scale;
    }

    updateScale(scale) {
        this.scale = scale;
    }

    get count() {
        return this.pointers.size;
    }

    get move() {
        return this.moves;
    }

    get coords() {
        return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0];
    }

    get first() {
        return this.pointers.values().next().value || this.lastCoords;
    }
}

function initShaderHero(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    // Set explicit width/height to match container
    const resize = () => {
        const { innerWidth, innerHeight } = window;
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
        if (renderer) renderer.updateScale(dpr);
    };

    const renderer = new WebGLRenderer(canvas, dpr);
    const pointers = new PointerHandler(canvas, dpr);

    renderer.setup();
    renderer.init();

    window.addEventListener('resize', resize);
    resize();

    const loop = (now) => {
        renderer.updateMouse(pointers.first);
        renderer.updatePointerCount(pointers.count);
        renderer.updatePointerCoords(pointers.coords);
        renderer.updateMove(pointers.move);
        renderer.render(now);
        requestAnimationFrame(loop);
    };

    loop(0);
}
