// --- Stereo-swapper ---
// Upload a stereo pair image → automatically swaps left/right halves

let inputImg = null;
let outputImgElement;
let dropZone;

function setup() {
  noCanvas();

  // --- Title ---
  createElement('h1', 'Stereo-swapper')
    .style('text-align', 'center')
    .style('margin-bottom', '20px');

  // --- Drop zone container ---
  let dropContainer = createDiv()
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('margin-bottom', '20px');

  dropZone = createDropZone('Drop Stereo Image Here', gotImageFile);
  dropContainer.child(dropZone.container);

  // --- Output display area ---
  createElement('h3', 'Swapped Image')
    .style('text-align', 'center')
    .style('margin-top', '10px');

  outputImgElement = createImg('', 'Swapped Stereo Image');
  outputImgElement.style('display', 'block')
    .style('margin', '20px auto')
    .style('border', '1px solid #ccc')
    .style('background', '#fafafa')
    .style('padding', '10px')
    .style('border-radius', '8px')
    .style('box-shadow', '0 2px 5px rgba(0,0,0,0.1)')
    .style('max-width', '90vw')
    .style('height', 'auto')
    .style('max-height', '80vh')
    .style('object-fit', 'contain')
    .hide();

  // --- Footer ---
  createElement('footer', '© Copyright lavaboosted')
    .style('text-align', 'center')
    .style('margin-top', '40px')
    .style('padding', '10px')
    .style('font-size', '14px')
    .style('color', '#666');
}

// --- Create Drop Zone ---
function createDropZone(labelText, callback) {
  let container = createDiv()
    .style('border', '2px dashed #999')
    .style('padding', '40px')
    .style('text-align', 'center')
    .style('width', '260px')
    .style('height', '180px')
    .style('line-height', '160px')
    .style('cursor', 'pointer')
    .style('background-color', '#fafafa')
    .style('position', 'relative')
    .style('overflow', 'hidden');

  createSpan(labelText).parent(container);

  let fileInput = createFileInput((file) => callback(file));
  fileInput.parent(container);
  fileInput.elt.style.display = 'none';

  container.mousePressed(() => fileInput.elt.click());
  container.dragOver(() => container.style('border-color', '#33aaff').style('background-color', '#e6f4ff'));
  container.dragLeave(() => container.style('border-color', '#999').style('background-color', '#fafafa'));
  container.drop((file) => {
    container.style('border-color', '#999').style('background-color', '#fafafa');
    callback(file);
  });

  return { container, fileInput };
}

// --- Handle uploaded image ---
function gotImageFile(file) {
  if (file && file.type === 'image') {
    loadImage(file.data, (img) => {
      inputImg = img;
      displayImageInZone(dropZone, img);
      swapStereo(); // 👈 automatically generate swapped version
      console.log('✅ Image loaded and swapped');
    });
  }
}

// --- Display thumbnail in drop zone ---
function displayImageInZone(zone, img) {
  zone.container.html('');
  createImg(img.canvas.toDataURL(), '')
    .style('width', '100%')
    .style('height', '100%')
    .style('object-fit', 'cover')
    .parent(zone.container);
}

// --- Core: swap left/right halves ---
function swapStereo() {
  if (!inputImg) return;

  let w = inputImg.width;
  let h = inputImg.height;
  let half = Math.floor(w / 2);

  let swapped = createGraphics(w, h);
  swapped.image(inputImg, 0, 0, half, h, half, 0, half, h); // right → left
  swapped.image(inputImg, half, 0, half, h, 0, 0, half, h); // left → right

  outputImgElement.attribute('src', swapped.canvas.toDataURL());
  outputImgElement.show();
}
