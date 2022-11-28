#!/usr/bin/env bash

// Create legend images from gdal color files

const fs = require('fs');
const path = require('path');
const {createCanvas} = require('canvas');

const INTPUT_FOLDER = path.resolve(__dirname, '../data/gdal-colors/');
const OUTPUT_FOLDER = path.resolve(__dirname, '../assets/legend-images/');
const WIDTH = 1;
const HEIGHT = 500;

const files = fs.readdirSync(INTPUT_FOLDER);

try {
  fs.mkdirSync(OUTPUT_FOLDER);
} catch (e) {
  console.log('Folder already exists');
}

files.forEach(file => {
  try {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    const colorRamp = readColorFile(file);
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    const max = colorRamp[0][0];
    const min = colorRamp[colorRamp.length - 1][0];
    const range = max - min;

    let lastColor = null;

    colorRamp.forEach(colorStop => {
      const [value, r, g, b, a] = colorStop;
      const stop = 1 - (value - min) / range;

      const alpha = Number(a) / 255;
      const hasAlpha = !isNaN(a);
      const color = `rgb${hasAlpha ? 'a' : ''}(${r}, ${g}, ${b}${
        hasAlpha ? `, ${alpha}` : ''
      })`;

      if (file.includes('lccs_class') && lastColor) {
        gradient.addColorStop(stop - 0.001, lastColor);
      }

      gradient.addColorStop(stop, color);

      lastColor = color;
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    writeImage(file, canvas);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`ERROR: No colors file found for ${file}`, err);
    return;
  }
});

function readColorFile(file) {
  const filePath = path.join(INTPUT_FOLDER, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const stops = content
    .split('\n')
    .filter(Boolean)
    .filter(line => !line.startsWith('nv'))
    .map(line => line.split(' '));

  if (file.includes('lswt')) {
    // do not include the "ice" color
    return stops.filter(([v]) => v > -1000);
  }

  return stops;
}

function writeImage(file, canvas) {
  const outFile = file.replace('colors-', '').replace('.txt', '.png');
  const outPath = path.resolve(OUTPUT_FOLDER, outFile);
  const out = fs.createWriteStream(outPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  // eslint-disable-next-line no-console
  out.on('finish', () => console.log(`Image was written to ${outPath}`));
}
