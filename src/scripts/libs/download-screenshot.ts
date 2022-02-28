import config from '../config/main';
import {LayerListItem} from '../types/layer-list';

// Downloads one or both Cesium canvases as an image file
export function downloadScreenshot(
  mainTimeFormat: string | boolean,
  compareTimeFormat: string | boolean,
  mainLayer: LayerListItem | null,
  compareLayer: LayerListItem | null
) {
  const canvases = Array.from(
    document.querySelectorAll('.cesium-viewer canvas') as NodeListOf<
      HTMLCanvasElement
    >
  );

  const fileName = createFileName(
    mainTimeFormat,
    compareTimeFormat,
    mainLayer?.name,
    compareLayer?.name
  );

  const finalCanvas = combineCanvases(canvases);
  const ctx = finalCanvas.getContext('2d');
  const esaLogo = new Image();
  const padding = 10;
  const usageInfo = `${mainLayer?.usageInfo ?? ''} ${compareLayer?.usageInfo ??
    ''}`;

  esaLogo.onload = function() {
    if (ctx !== null) {
      ctx.font = '10px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
      ctx.fillText(usageInfo, 10, finalCanvas.height - padding);

      ctx.drawImage(
        esaLogo,
        window.innerWidth - esaLogo.width - padding,
        window.innerHeight - esaLogo.height - padding,
        esaLogo.width,
        esaLogo.height
      );
    }

    download(finalCanvas.toDataURL(), fileName);
  };

  esaLogo.setAttribute('crossOrigin', 'anonymous');
  esaLogo.src = config.esaLogo;
}

function combineCanvases(canvases: HTMLCanvasElement[]) {
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
