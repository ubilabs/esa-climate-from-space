#!/usr/bin/env bash

// Create legend images from gdal color files

const fs = require("fs");
const { createCanvas } = require("/usr/lib/node_modules/canvas");

const COLOR_FILE = process.env.COLOR_FILE;
const FILEPATH_OUT = process.env.FILEPATH_OUT;
const WIDTH = 1;
const HEIGHT = 500;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');
const colorRamp = readColorFile(COLOR_FILE);
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

  if (COLOR_FILE.includes('lccs_class') && lastColor) {
    gradient.addColorStop(stop - 0.001, lastColor);
  }

  gradient.addColorStop(stop, color);

  lastColor = color;
});

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

writeImage(FILEPATH_OUT, canvas);

function readColorFile(file) {
  const content = fs.readFileSync(file, 'utf8');
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
  const out = fs.createWriteStream(file);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Image was written to ${FILEPATH_OUT}`));
}
