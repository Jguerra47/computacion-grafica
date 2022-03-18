const vertexShaderCode = `
    attribute vec4 a_position;
    uniform mat4 u_rotation_matrix;
    uniform mat4 u_scale_matrix;
    uniform vec4 u_translate_vec;

    void main(){
        gl_Position = a_position * u_rotation_matrix * u_scale_matrix + u_translate_vec;
    }
    `

const fragmentShaderCode = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0, 0.6, 0.0, 1.0);
    }
    `

function createShader(gl, type, source){
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if(success){
        return shader
    }
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function linkShaders(ID){
    const canvas = document.getElementById(ID)
    const gl = canvas.getContext("webgl")

    if(gl == null){
        alert("Algo malo pasó")
        return
    }
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode)
    
    const app = gl.createProgram()
    gl.attachShader(app, vertexShader)
    gl.attachShader(app, fragmentShader)
    gl.linkProgram(app)

    if(!gl.getProgramParameter(app, gl.LINK_STATUS)){
        console.error(gl.getProgramInfoLog(app))
        gl.deleteProgram(app)
        return
    }

    gl.useProgram(app)

    const draw = (positions, matrices, erase) => {
        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
        
        gl.clearColor(0.0, 0.1, 0.1, 1.0)
        if(erase) gl.clear(gl.COLOR_BUFFER_BIT)

        const positionAttributeLocation = gl.getAttribLocation(app, "a_position")
        const rotationUniformLocation = gl.getUniformLocation(app, "u_rotation_matrix")
        const scaleUniformLocation = gl.getUniformLocation(app, "u_scale_matrix")
        const translateUniformLocation = gl.getUniformLocation(app, "u_translate_vec")

        gl.uniformMatrix4fv(rotationUniformLocation, false, matrices.rotation);
        gl.uniformMatrix4fv(scaleUniformLocation, false, matrices.scalation);
        gl.uniform4fv(translateUniformLocation, matrices.translation)

        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.vertexAttribPointer(
            positionAttributeLocation,
            2,                          //Tamaño
            gl.FLOAT,                   //Tipo
            false,
            0,
            0           
        )
        gl.drawArrays(
            gl.LINE_STRIP,
            0,
            (positions.length)/2
        )
    }    
    return draw
}

