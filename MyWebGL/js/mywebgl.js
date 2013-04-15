function MyWebGL() {
	this.canvas = null;
	this.WIDTH = null;
	this.HEIGHT = null;
	this.ASPECT = null;
	this.NEAR = null;
	this.FAR = null;
	this.FOV = null;
	
	this.gl = null;
	this.vs = null;
	this.fs = null;
	this.program = null;
	
	this.textures = [];
	
	this.pMatrix = null;
	this.mvMatrix = null;

// Initialisation methods

	function init(name, width, height, near, far, fov) {
		// Get WebGL context
		this.canvas = document.getElementById(isDef(name, "canvas"));

		this.canvas.width = isDef(width, window.innerWidth-10);
		this.canvas.height = isDef(height, window.innerHeight-21);

		this.WIDTH = this.canvas.width;
		this.HEIGHT = this.canvas.height;
		this.ASPECT = this.WIDTH / this.HEIGHT;
		this.NEAR = isDef(near, 0.1);
		this.FAR = isDef(far, 1000);
		this.FOV = isDef(fov, 45);
	}
	
	function initWebGL(clearColorStrRGBA) {
		// Initialise WebGL
		this.gl = app.canvas.getContext("experimental-webgl");
		
		if(!this.gl) {
			alert("WebGL initialisation failed.");
		}
		var str = isDef(clearColorStrRGBA, "333333FF");
		try {
			parseInt(str, 16);
		} catch(err) {
			console.log("Not suitable RGBA value for clear color, using default.");
			str = "333333FF";
		}
		var r,g,b,a;
		if(str.length === 8) {
			r = parseInt(str.substr(0, 2), 16) / 255;
			g = parseInt(str.substr(2, 2), 16) / 255;
			b = parseInt(str.substr(4, 2), 16) / 255;
			a = parseInt(str.substr(6, 2), 16) / 255;
		}
		this.gl.clearColor(r,g,b,a);
		this.gl.enable(gl.DEPTH_TEST);
	}
	
	function getShader(id, type) {
		if(typeof jQuery === 'undefined') {
			console.log("jQuery not loaded, unable to load shaders.");
			return;
		}
		
		var shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, $("#"+id).text());
		this.gl.compileShader(shader);
				
		if(type === this.gl.VERTEX_SHADER) {
			if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
				alert("Vertex Shader:\n" + this.gl.getShaderInfoLog(shader));
			} else {
				this.vs = shader;
			}
		} else if(type === this.gl.FRAGMENT_SHADER) {
			if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
				alert("Fragment Shader:\n" + this.gl.getShaderInfoLog(shader));
			} else {
				this.fs = shader;
			}
		}
	}
	
	function initProgram(vs, fs, useProgram) {
		// Create program and link shaders to it
		var prog = this.gl.createProgram();
		this.gl.attachShader(prog, isDef(vs, this.vs));
		this.gl.attachShader(prog, isDef(fs, this.fs));
		this.gl.linkProgram(prog);

		if(!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
			alert("Shader Program:\n" + this.gl.getProgramInfoLog(prog));
		}
		
		if(isDef(useProgram, false)) {
			this.gl.useProgram(prog);
		}
		this.program = prog;
	}

	function loadTexture(src, minFilter, magFilter, type, target) {
		var texture = this.gl.createTexture();

		texture.image = new Image();
		texture.image.target = isDef(target, this.gl.TEXTURE_2D);
		texture.image.type = isDef(type, this.gl.TEXTURE_2D);
		texture.image.onload = function() { 
			this.gl.bindTexture(texture.image.type, texture);
			this.gl.texImage2D(texture.image.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			this.gl.texParameteri(texture.image.type, gl.TEXTURE_MIN_FILTER, isDef(minFilter, gl.LINEAR));
			this.gl.texParameteri(texture.image.type, gl.TEXTURE_MAG_FILTER, isDef(magFilter, gl.LINEAR));
			if(isDef(minFilter))
				this.gl.generateMipmap(texture.image.type);
			this.gl.bindTexture(texture.image.type, null);
		};
		texture.image.src = src;
		
		this.textures.push(texture);
		return texture;
	}

// Rendering methods

	function clear() {
		// Clear the canvas
		this.gl.viewport(0, 0, this.WIDTH, this.HEIGHT);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}
	
	function initCamera() {
		if(typeof mat4 === 'undefined') {
			console.log("glMatrix library required for rendering.");
			return;
		}
		
		// Define the perspective
		this.pMatrix = mat4.create();
		this.mvMatrix = mat4.create();
		mat4.perspective(this.FOV, this.ASPECT, this.NEAR, this.FAR, this.pMatrix);
		mat4.identity(this.mvMatrix);
	}
	
// Utilities

	function isDef(variable, defVal) {
		if(typeof defVal !== 'undefined') {
			return typeof variable !== 'undefined' ? variable : defVal;
		} else {
			return typeof variable !== 'undefined';
		}
	}
}