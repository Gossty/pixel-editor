const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let img = new Image();
let imageName = '';

var brightness;
var contrast;
var saturate;
var pixelating;
var blure;
var dropShadow;

var pixelStack = [];

const downloadBtn = document.getElementById("download-btn");
const uploadFile = document.getElementById("upload-file");
const revertBtn = document.getElementById("revert-btn");

var size;


//Filters and effect
document.addEventListener('click', (e) => {

	
	if (e.target.classList.contains("pixel")) {
		size = document.getElementById("size").value;
		size = parseInt(size);
		pixelating = size;
		pixelate(img, pixelating);
		ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blure}px)`
		ctx.drawImage(img, 0, 0, img.width, img.height);
	}

	else if (e.target.classList.contains('filter-btn')) {

		// brightness
		if (e.target.classList.contains('brightness-add')) {
			brightness += 25;
		}
		else if (e.target.classList.contains('brightness-reduce')) {
			brightness -= 25;
		}
		
		// contrast
		else if (e.target.classList.contains('contrast-add')) {
			contrast += 25;
		}
		else if (e.target.classList.contains('contrast-reduce')) {
			contrast -= 25;
		}
			
		// saturation		
		else if (e.target.classList.contains('saturation-add')) {
			saturate += 25;
		}
		else if (e.target.classList.contains('saturation-reduce')) {
			saturate -= 25;
		}

		else if (e.target.classList.contains('blur-add')) {
			blure += 3;
		}
		else if (e.target.classList.contains('blur-reduce')) {
			if (blure !== 0)
				blure -= 3;
		}
		ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blure}px)`
		ctx.drawImage(img, 0, 0, img.width, img.height);

		if (e.target.classList.contains('vintage-add')) {
			Caman("#canvas", img, function () {
				this.vintage().render();
			});
		}
		else if (e.target.classList.contains('lomo-add')) {
			Caman("#canvas", img, function () {
				this.lomo().render();
			});
		}

		else if (e.target.classList.contains("sincity-add")) {
			Caman("#canvas", img, function () {
				this.sinCity().render();
			});
		}
		else if (e.target.classList.contains("crossprocess-add")) {
			Caman("#canvas", img, function () {
				this.crossProcess().render();
			});
		}

		else if (e.target.classList.contains("nostalgia-add")) {
			Caman("#canvas", img, function () {
				this.nostalgia().render();
			});
		}
	}
	else if (e.target.classList.contains("application")) {
		ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blure}px)`
		ctx.drawImage(img, 0, 0, img.width, img.height);

	}
})


// Revert Filters
revertBtn.addEventListener("click", e => {
	brightness = 100;
	contrast = 100;
	saturate = 100;
	pixelating = 1;
	blure = 0;
	pixelating = 1;
	img.src = pixelStack[0];
	ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blure}px)`
	ctx.drawImage(img, 0, 0, img.width, img.height);
	Caman("#canvas", img, function() {
		this.revert();
	  });
});
  

/**
 * Helper method for pixelating
 * @param {*} img 
 * @param {*} pixelationFactor 
 */
function pixelate(img, pixelationFactor) {
	img.src = pixelStack[0];
	const canv = document.createElement("canvas");
	const context = canv.getContext("2d");
	const width = img.width;
	const height = img.height;
	const canvWidth = width;
	const canvHeight = height;
	canv.width = canvWidth;
	canv.height = canvHeight;

	context.drawImage(img, 0, 0, width, height);
	const imgData = context.getImageData(0, 0, width, height).data;
	for (let y = 0; y < height; y += pixelationFactor) {
		for (let x = 0; x < width; x += pixelationFactor) {
		  // extracting the position of the sample pixel
			const pixel = (x + y * width) * 4;
		  // drawing a square replacing the current pixels
		  	context.fillStyle = `rgba(
			${imgData[pixel]},
			${imgData[pixel + 1]},
			${imgData[pixel + 2]},
			${imgData[pixel + 3]})`;
		  context.fillRect(x, y, pixelationFactor, pixelationFactor);
		}
	}
	img.src = canv.toDataURL();
	ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blure}px)`
	ctx.drawImage(img, 0, 0, img.width, img.height);
}



// Uploading a file
uploadFile.addEventListener("change", () => {
	brightness = 100;
	contrast = 100;
	saturate = 100;
	pixelating = 1;
	blure = 0;
	pixelStack = [];
	
	const file = document.getElementById("upload-file").files[0];
  	const reader = new FileReader();

  	if (file) {
    	imageName = file.name;
    	reader.readAsDataURL(file);
 	}

  	reader.addEventListener(
  		"load",
    	() => {
			img = new Image();
			img.src = reader.result;
			pixelStack.push(img.src);
			size = 0;
      		img.onload = function() {
        		canvas.width = img.width;
        		canvas.height = img.height;
        		ctx.drawImage(img, 0, 0, img.width, img.height);
        		canvas.removeAttribute("data-caman-id");
				};
    	},
    	false
  	);
});


/**
 * Download event
 */
downloadBtn.addEventListener("click", () => {
  // Get ext
  const fileExtension = imageName.slice(-4);
  let newFilename;
  
  // creates a new image name
  if (fileExtension === ".jpg" || fileExtension === ".png") {
    newFilename = imageName.substring(0, imageName.length - 4) + "-effects.jpg";
  }

  download(canvas, newFilename);
});

function download(canvas, filename) {
  // Init event
  let e;
  // Create link
  const link = document.createElement("a");

  // Set props
  link.download = filename;
  link.href = canvas.toDataURL("image/jpeg", 0.89);
  // New mouse event
  e = new MouseEvent("click");
  // Dispatch event
  link.dispatchEvent(e);
}