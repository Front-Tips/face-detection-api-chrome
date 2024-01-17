class FaceDetectorApp {
  constructor(imageId, canvasId) {
    this.image = document.getElementById(imageId);
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.scale = this.canvas.width / this.image.width;
    this.drawInitialImage();
  }

  // Draws the initial image onto the canvas.
  drawInitialImage() {
    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  // Adjusts the canvas size to match the image dimensions.
  adjustCanvasSize() {
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.scale = this.canvas.width / this.image.width;
  }

  // Redraws the image on the canvas.
  imageLoaded() {
    this.adjustCanvasSize();
    this.drawInitialImage();
  }

  // Initiates face detection on the image.
  faceDetection() {
    if (window.FaceDetector === undefined) {
      console.error("Face Detection not supported");
      return;
    }

    // Create an instance of the FaceDetector API.
    const faceDetector = new FaceDetector();

    // Detect faces in the image and handle the results.
    faceDetector
      .detect(this.image)
      .then((faces) => this.handleFaces(faces))
      .catch((e) => {
        console.error(`Face Detection failed: ${e}`);
      });
  }

  // Processes detected faces and updates the canvas.
  handleFaces(faces) {
    this.drawBlackSquare();

    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "yellow";
    this.ctx.setLineDash([5, 3]);

    faces.forEach((face) => this.drawFace(face.boundingBox));
    this.showStats(faces);
  }

  // Draws a dashed bounding box around a detected face.
  drawFace(face) {
    this.ctx.rect(
      Math.floor(face.x * this.scale),
      Math.floor(face.y * this.scale),
      Math.floor(face.width * this.scale),
      Math.floor(face.height * this.scale)
    );
    this.ctx.stroke();
  }

  // Dim the picture
  drawBlackSquare() {
    const squareSize = this.canvas.width;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, squareSize, squareSize);
  }

  // Show the number of detected faces.
  showStats(faces) {
    const stats = document.querySelector(".stats");
    stats.innerHTML = `<p><b>${faces.length}</b> Faces Detected</p>`;
  }
}

// Usage
const app = new FaceDetectorApp("image", "canvas");
window.faceDetection = () => app.faceDetection();
window.imageLoaded = () => app.imageLoaded();
