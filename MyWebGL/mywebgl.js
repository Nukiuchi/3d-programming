function MyWebGL() {
	this.canvas = null;
	this.WIDTH = null;
	this.HEIGHT = null;
	this.ASPECT = null;
	this.NEAR = null;
	this.FAR = null;
	this.FOV = null;
	
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
	
	function isDef(variable, defVal) {
		return typeof variable !== 'undefined' ? variable : defVal;
	}
}