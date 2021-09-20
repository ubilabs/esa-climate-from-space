// Downloads one or both Cesium canvases as an image file
export function downloadScreenshot(
  mainTimeFormat: string | boolean,
  compareTimeFormat: string | boolean,
  mainLayerName?: string,
  compareLayerName?: string
) {
  const canvases = Array.from(
    document.querySelectorAll('.cesium-viewer canvas') as NodeListOf<
      HTMLCanvasElement
    >
  );

  const fileName = createFileName(
    mainTimeFormat,
    compareTimeFormat,
    mainLayerName,
    compareLayerName
  );

  const finalCanvas = combineCanvases(canvases);
  download(finalCanvas.toDataURL(), fileName);
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

function download(url: string, fileName?: string) {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName ?? 'globe.png');
  link.style.display = 'none';

  document.body.appendChild(link);

  setTimeout(() => {
    link.click();
    document.body.removeChild(link);
  }, 1);
}

function createFileName(
  mainTimeFormat: string | boolean,
  compareTimeFormat: string | boolean,
  mainLayerName?: string,
  compareLayerName?: string
) {
  const mainName =
    mainLayerName &&
    // eslint-disable-next-line prefer-template
    `${mainLayerName} ${mainTimeFormat ? '- ' + mainTimeFormat : ''}`;

  const compareName =
    compareLayerName &&
    // eslint-disable-next-line prefer-template
    `${compareLayerName} ${compareTimeFormat ? '- ' + compareTimeFormat : ''}`;

  const finalName = compareLayerName
    ? `${mainName} & ${compareName}`
    : mainName;

  return finalName;
}
