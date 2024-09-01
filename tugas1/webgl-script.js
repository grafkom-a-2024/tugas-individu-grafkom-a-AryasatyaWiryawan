const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL tidak didukung pada browser ini.");
}

// Vertex shader
const vertexShaderSource = `
    attribute vec4 a_position;

    void main() {
        gl_Position = a_position;
    }
`;

// Fragment shader
const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
`;

// Fungsi untuk membuat shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Membuat vertex dan fragment shader
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Fungsi untuk membuat program WebGL
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// Membuat program WebGL
const program = createProgram(gl, vertexShader, fragmentShader);

// Mendapatkan lokasi atribut posisi dan uniform warna
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorUniformLocation = gl.getUniformLocation(program, "u_color");

// Membuat buffer untuk posisi vertex
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Mengatur viewport dan membersihkan canvas
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.9, 0.9, 0.9, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// Menggunakan program yang telah dibuat
gl.useProgram(program);

// Mengaktifkan dan mengatur atribut posisi
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Fungsi untuk mengatur posisi dan menggambar segitiga
function drawTriangle(positions, color) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.uniform4fv(colorUniformLocation, color);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Menggambar segitiga-segitiga dengan ukuran, posisi, dan warna berbeda
drawTriangle([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5], [1, 0, 0.5, 1]); // Ungu
drawTriangle([-0.25, 0.1, 0.25, 0.1, 0.0, 0.6], [0, 0.5, 1, 1]); // Biru muda
drawTriangle([-0.4, -0.2, 0.0, -0.2, -0.2, 0.3], [0, 1, 0.5, 1]); // Hijau muda
drawTriangle([0.2, -0.4, 0.6, -0.4, 0.4, 0.0], [1, 0.8, 0, 1]); // Kuning
