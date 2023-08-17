import esaLogoSrc from '~/assets/images/esa-logo.png';

import {LayerListItem} from '../types/layer-list';

// Downloads one or both Cesium canvases as an image file
export function downloadScreenshot(
  mainTimeFormat: string | boolean,
  compareTimeFormat: string | boolean,
  mainLayer: LayerListItem | null,
  compareLayer: LayerListItem | null
) {
  const canvases: HTMLCanvasElement[] = Array.from(
    document.querySelectorAll('canvas')
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
  const usageInfos = [mainLayer?.usageInfo, compareLayer?.usageInfo];
  // avoid showing the same usage info twice
  const usageInfo = [...new Set(usageInfos)].filter(Boolean).join(' ');

  esaLogo.onload = () => {
    if (!ctx) {
      return;
    }

    ctx.font = '10px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.fillText(usageInfo, 10, finalCanvas.height - padding);

    ctx.drawImage(
      esaLogo,
      ctx.canvas.width - esaLogo.width,
      0,
      esaLogo.width,
      esaLogo.height
    );

    download(finalCanvas.toDataURL(), fileName);
  };

  esaLogo.setAttribute('crossOrigin', 'anonymous');
  esaLogo.src = esaLogoSrc;
}

function combineCanvases(canvases: HTMLCanvasElement[]) {
  const canvas = document.createElement('canvas');

  const width = canvases.reduce((w, c) => w + c.width, 0);
  const height = canvases[0].height;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('failed to create 2d context');
  }

  ctx.fillStyle = '#10161a';
  ctx.fillRect(0, 0, width, height);

  let xOffset = 0;
  for (const c of canvases) {
    ctx.drawImage(c, xOffset, 0);
    xOffset += c.width;
  }

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

  return `${finalName}.png`;
}
