import fs from "fs";
import path from "path";
import { gzipSync } from "zlib";

function getAllJsonFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(fullPath));
    } else if (file.endsWith(".json")) {
      results.push(fullPath);
    }
  });
  return results;
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const storageDir = path.join(__dirname, "storage");
const layersDir = path.join(storageDir, "layers");
const storiesDir = path.join(storageDir, "stories");

const languages = ["en", "de", "fr", "es"];

languages.forEach((lang) => {
  // Collect all layers and only the main stories-<lang>.json file for this language
  const layerFiles = getAllJsonFiles(layersDir).filter((f) =>
    f.endsWith(`-${lang}.json`),
  );
  // Only include stories-<lang>.json (not individual story-XX-<lang>.json files)
  const mainStoriesFile = getAllJsonFiles(storiesDir).find((f) =>
    f.endsWith(`stories-${lang}.json`),
  );

  // Read and collect all layers
  const layers = [];
  layerFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");
      const json = JSON.parse(content);
      if (Array.isArray(json)) {
        layers.push(...json);
      }
    } catch (e) {
      console.error(`Error reading or parsing ${file}:`, e);
    }
  });

  // Read and collect all stories
  let stories = [];
  if (mainStoriesFile) {
    try {
      const content = fs.readFileSync(mainStoriesFile, "utf8");
      const json = JSON.parse(content);
      if (Array.isArray(json)) {
        stories = json;
      }
    } catch (e) {
      console.error(`Error reading or parsing ${mainStoriesFile}:`, e);
    }
  }

  // Append slides from story-XX-<lang>.json to stories-<lang>.json entries
  stories.forEach((story) => {
    if (story.id && story.id.startsWith("story-")) {
      // Find the corresponding story-XX-<lang>.json file
      const storyFile = getAllJsonFiles(storiesDir).find((f) =>
        f.endsWith(`/${story.id}/${story.id}-${lang}.json`),
      );
      if (storyFile) {
        try {
          const storyJson = JSON.parse(fs.readFileSync(storyFile, "utf8"));
          if (storyJson.slides) {
            story.slides = storyJson.slides;
          }
        } catch (e) {
          console.error(`Error reading or parsing ${storyFile}:`, e);
        }
      }
    }
  });

  const outFile = path.join(storageDir, `/index/storage-index-${lang}.json`);
  fs.writeFileSync(
    outFile,
    JSON.stringify({ layers, stories }, null, 2),
    "utf8",
  );
  const gzipped = gzipSync(JSON.stringify({ layers, stories }, null, 2));
  const outFileGzipped = path.join(
    storageDir,
    `/index/storage-index-${lang}.json.gz`,
  );
  fs.writeFileSync(outFileGzipped, gzipped);
  console.log(
    `Merged and gzipped all ${lang} stories and layers JSON files into ${outFileGzipped}`,
  );
});
