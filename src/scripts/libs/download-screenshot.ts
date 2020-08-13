// Downloads one or both Cesium canvases as an image file
export function downloadScreenshot() {
  const canvases = Array.from(
    document.querySelectorAll('.cesium-viewer canvas') as NodeListOf<
      HTMLCanvasElement
    >
  );

  const finalCanvas = combineCanvases(canvases);
  download(finalCanvas.toDataURL());
}

function combineCanvases(canvases: HTMLCanvasElement[]) {
  if (canvases.length < 2) {
    return canvases[0];
  }

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  canvases.forEach((tmpCanvas, index) =>
    ctx?.drawImage(tmpCanvas, (window.innerWidth / 2) * index, 0)
  );

  return canvas;
}

function download(url: string) {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'globe.png');
  link.style.display = 'none';

  document.body.appendChild(link);

  setTimeout(() => {
    link.click();
    document.body.removeChild(link);
  }, 1);
}
