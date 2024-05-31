import * as THREE from 'three'
// import resolveLygia from "lygia"
// const pnoise = require("../../lygia/generative/pnoise.glsl")
let uniforms = {
    u_time: {value: 0},
    u_resolution: {value: new THREE.Vector2(360, 480)},
    mouse: {value: new THREE.Vector2(0,0)},
    mvel: {value: new THREE.Vector2(0,0)}
}

//GLSL Shader
let fragmentShader = /* glsl */`


precision mediump float;

// #include "../../lygia/generative/pnoise.glsl";

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec2 mvel;

float pnoise(vec2 p) {
    return p.x + p.y;
}

mat2 inverse(mat2 m) {
    return mat2(m[1][1],-m[0][1],
        -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);
}

float steeper(float x, float midpoint_h) {
    float a = 2.0 - 4.0 * midpoint_h;
    float px = x * (a * x + (1.0-a));
    return clamp(px, 0.0, 1.0);
}

vec2 nearest_lattice_pt(vec2 x, mat2 G){
    mat2 ginv = inverse(G);
    vec2 anti_pjn = ginv * x;
    vec2 tl = vec2(floor(anti_pjn.x), floor(anti_pjn.y));
    vec2 tr = vec2(ceil(anti_pjn.x), floor(anti_pjn.y));
    vec2 bl = vec2(floor(anti_pjn.x), ceil(anti_pjn.y));
    vec2 br = vec2(ceil(anti_pjn.x), ceil(anti_pjn.y));

    float best_d = distance(x, G * tl);
    vec2 best_pt = G * tl;
    
    vec2 u;

    u = G * tr;
    if (distance(x, u) <= best_d) {
        best_pt = u;
        best_d = distance(x, u);
    }
    u = G * bl;
    if (distance(x, u) <= best_d) {
        best_pt = u;
        best_d = distance(x, u);
    }
    u = G * br;
    if (distance(x, u) <= best_d) {
        best_pt = u;
        best_d = distance(x, u);
    }

    return best_pt;    
}

void main() {
    // vec2 uv = gl_FragCoord.x / 1000.0;
    // vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
    // gl_FragColor = vec4(color, 1.0);

    vec2 uv = gl_FragCoord.xy / u_resolution;
    // Distort UVs according to mouse pos
    vec2 offset = uv - mouse;
    float speed_mdf = 1.0 - exp(-10.0 * length(mvel));
    float dir_dot = dot(normalize(mvel), normalize(offset));
    float smoothed_dir_dot = steeper(0.5 * (1.0 + dir_dot), 0.8);
    float uv_change_size = smoothed_dir_dot*speed_mdf*0.2*exp(-2.0*length(offset))*sin(20.0*length(offset));
    uv += uv_change_size * normalize(offset);
    uv = vec2(clamp(uv.x, 0.0, 1.0), clamp(uv.y, 0.0, 1.0));
    vec2 time_vector = vec2(sin(u_time), cos(u_time));
    // float b = dot(uv.xy, time_vector);

    // gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0);
    mat2 G = 0.3*mat2(vec2(-1.0, -0.5), vec2(0.2, 0.2));
    vec2 nrst = nearest_lattice_pt(uv, G);
    float r = mix(nrst.x, 1.0, 0.0);
    float g = 1.0 - exp(-5.0* (log(1.1 + 2.0*length(mvel))*exp(-3.0 * length(offset))));
    float b = mix(nrst.y, 0.7, 0.4);
    gl_FragColor = vec4(r, 0.2 + 0.8 * g, b, 1.0);
}
`

const mat = new THREE.ShaderMaterial({
    fragmentShader: fragmentShader,
    uniforms: uniforms
})
let quad = [[-1, -1],[-1, 1],[1, 1],[1, -1]].map((x) => new THREE.Vector2(x[0], x[1]))
let shape = new THREE.ShapeGeometry(new THREE.Shape(quad))
let scene = new THREE.Scene()
let ico = new THREE.Mesh(shape, mat)
scene.add(ico)

let canvas = document.getElementById("shader")
let renderer = new THREE.WebGLRenderer({canvas: canvas})
let aspectRatio = 1;
let camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100)
camera.position.z = 1

document.onmousemove = (event) => {
    uniforms.mvel.value = new THREE.Vector2(event.movementX/innerWidth, - event.movementY/innerHeight)
    uniforms.mouse.value = new THREE.Vector2(event.clientX/innerWidth, 1 - event.clientY/innerHeight)
}
function tick(){
    uniforms.u_resolution.value = new THREE.Vector2(renderer.domElement.width, renderer.domElement.height)
    uniforms.u_time.value += 0.1
    renderer.render(scene, camera)
}
tick()
setInterval(() => tick(), 30)
