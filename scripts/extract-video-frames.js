#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawn, spawnSync } from "child_process";

const DEFAULTS = {
  fps: 15,
  width: 720,
  height: null,
  format: "webp",
  quality: 82,
  prefix: "frame",
};

const SUPPORTED_FORMATS = new Set(["webp", "jpg", "jpeg", "png"]);

function printUsage() {
  console.log(`Usage: node ./scripts/extract-video-frames.js --input <video> --output <dir> [options]

Extract a numbered image sequence from a video for canvas-based web animations.

Required:
  --input <path>       Source video file
  --output <path>      Output directory for extracted frames

Optional:
  --fps <number>       Frames per second to extract (default: ${DEFAULTS.fps})
  --width <number>     Output width in pixels (default: ${DEFAULTS.width})
  --height <number>    Output height in pixels (default: auto)
  --format <type>      webp, jpg, jpeg, png (default: ${DEFAULTS.format})
  --quality <1-100>    Output quality for webp/jpg (default: ${DEFAULTS.quality})
  --prefix <name>      Output filename prefix (default: ${DEFAULTS.prefix})
  --help               Show this help message

Examples:
  node ./scripts/extract-video-frames.js --input ./video.mp4 --output ./frames
  node ./scripts/extract-video-frames.js --input ./video.mp4 --output ./frames --fps 24 --width 1080
  node ./scripts/extract-video-frames.js --input ./video.mp4 --output ./frames --width 1080 --height 1080 --format png`);
}

function parseArgs(argv) {
  const options = {
    input: null,
    output: null,
    fps: DEFAULTS.fps,
    width: DEFAULTS.width,
    height: DEFAULTS.height,
    format: DEFAULTS.format,
    quality: DEFAULTS.quality,
    prefix: DEFAULTS.prefix,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const key = arg.slice(2);
    const value = argv[i + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    switch (key) {
      case "input":
        options.input = value;
        break;
      case "output":
        options.output = value;
        break;
      case "fps":
        options.fps = parsePositiveNumber(value, "fps", false);
        break;
      case "width":
        options.width = parsePositiveNumber(value, "width", true);
        break;
      case "height":
        options.height = parsePositiveNumber(value, "height", true);
        break;
      case "format":
        options.format = normalizeFormat(value);
        break;
      case "quality":
        options.quality = parseQuality(value);
        break;
      case "prefix":
        options.prefix = value;
        break;
      default:
        throw new Error(`Unknown option: --${key}`);
    }

    i += 1;
  }

  return options;
}

function parsePositiveNumber(value, name, integerOnly) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`--${name} must be a positive number.`);
  }

  if (integerOnly && !Number.isInteger(parsed)) {
    throw new Error(`--${name} must be a positive integer.`);
  }

  return parsed;
}

function parseQuality(value) {
  const quality = parsePositiveNumber(value, "quality", true);

  if (quality < 1 || quality > 100) {
    throw new Error("--quality must be between 1 and 100.");
  }

  return quality;
}

function normalizeFormat(value) {
  const format = value.toLowerCase();

  if (!SUPPORTED_FORMATS.has(format)) {
    throw new Error(`Unsupported format: ${value}. Use webp, jpg, jpeg, or png.`);
  }

  return format === "jpeg" ? "jpg" : format;
}

function ensureFfmpeg() {
  const result = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });

  if (result.error || result.status !== 0) {
    throw new Error("ffmpeg is required but was not found in PATH.");
  }
}

function buildScaleFilter(width, height) {
  if (width && height) {
    return `scale=${width}:${height}:force_original_aspect_ratio=decrease`;
  }

  if (width) {
    return `scale=${width}:-1`;
  }

  if (height) {
    return `scale=-1:${height}`;
  }

  return null;
}

function buildFilter(options) {
  const filters = [`fps=${options.fps}`];
  const scaleFilter = buildScaleFilter(options.width, options.height);

  if (scaleFilter) {
    filters.push(scaleFilter);
  }

  return filters.join(",");
}

function getCodecArgs(format, quality) {
  switch (format) {
    case "webp":
      return [
        "-c:v",
        "libwebp",
        "-lossless",
        "0",
        "-compression_level",
        "6",
        "-q:v",
        String(quality),
      ];
    case "jpg":
      return ["-q:v", String(mapJpegQuality(quality))];
    case "png":
      return ["-compression_level", "9"];
    default:
      return [];
  }
}

function mapJpegQuality(quality) {
  const qscale = Math.round(31 - (quality - 1) * (29 / 99));
  return Math.min(31, Math.max(2, qscale));
}

function resolveOutputPattern(outputDir, prefix, format) {
  return path.join(outputDir, `${prefix}-%04d.${format}`);
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "inherit" });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`ffmpeg exited with code ${code}.`));
    });
  });
}

function validateRequiredOptions(options) {
  if (!options.input || !options.output) {
    throw new Error("Both --input and --output are required.");
  }
}

function printSummary(options, outputPattern) {
  console.log(`Extracting frames from ${options.input}`);
  console.log(`Output directory: ${options.output}`);
  console.log(`Filename pattern: ${outputPattern}`);
  console.log(`Format: ${options.format}`);
  console.log(`FPS: ${options.fps}`);
  console.log(`Width: ${options.width ?? "auto"}`);
  console.log(`Height: ${options.height ?? "auto"}`);
  if (options.format !== "png") {
    console.log(`Quality: ${options.quality}`);
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
      printUsage();
      return;
    }

    validateRequiredOptions(options);
    ensureFfmpeg();

    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output);

    if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
      throw new Error(`Input file not found: ${options.input}`);
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const resolvedOptions = {
      ...options,
      input: inputPath,
      output: outputDir,
    };

    const outputPattern = resolveOutputPattern(
      outputDir,
      resolvedOptions.prefix,
      resolvedOptions.format,
    );

    const ffmpegArgs = [
      "-y",
      "-i",
      inputPath,
      "-an",
      "-vf",
      buildFilter(resolvedOptions),
      ...getCodecArgs(resolvedOptions.format, resolvedOptions.quality),
      outputPattern,
    ];

    printSummary(resolvedOptions, outputPattern);
    await runFfmpeg(ffmpegArgs);
    console.log("Frame extraction complete.");
  } catch (error) {
    console.error(error.message);
    console.error("Use --help to see the available options.");
    process.exitCode = 1;
  }
}

main();
