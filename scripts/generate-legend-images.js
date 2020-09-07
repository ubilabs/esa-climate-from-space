#!/usr/bin/env bash

// Create legend images from gdal color files

const fs = require('fs');
const path = require('path');
const {createCanvas} = require('canvas');
const layers = require(path.resolve(__dirname, '../data/layers-config.json'));

const INTPUT_FOLDER = path.resolve(__dirname, '../data/gdal-colors/');
const OUTPUT_FOLDER = path.resolve(__dirname, '../storage/legend-images/');
const WIDTH = 1;
const HEIGHT = 500;

const variables = Object.keys(layers).map(id => id.split('.')[1]);

variables.forEach(variable => {
  try {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    const colorRamp = readColorFile(variable);
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

      if (variable === 'lccs_class' && lastColor) {
        gradient.addColorStop(stop - 0.001, lastColor);
      }

      gradient.addColorStop(stop, color);

      lastColor = color;
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    writeImage(variable, canvas);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`ERROR: No colors file found for ${variable}`, err);
    return;
  }
});

// read file from /data/gdal-colors/color-{variable}.txt
function readColorFile(variable) {
  const file = path.resolve(INTPUT_FOLDER, `colors-${variable}.txt`);
  const content = fs.readFileSync(file, 'utf8');
  return content
    .split('\n')
    .filter(Boolean)
    .filter(line => !line.startsWith('nv'))
    .map(line => line.split(' '));
}

// write image to /storage/legend-images/{variable}.png
function writeImage(variable, canvas) {
  const outPath = path.resolve(OUTPUT_FOLDER, `${variable}.png`);
  const out = fs.createWriteStream(outPath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  // eslint-disable-next-line no-console
  out.on('finish', () => console.log(`${variable} was written to ${outPath}.`));
}
