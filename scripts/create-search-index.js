import fs from "fs";
import path from "path";

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

const storageDir = "./storage";
const layersDir = path.join(storageDir, "layers");
const storiesDir = path.join(storageDir, "stories");

const languages = ["en", "de", "fr", "es"];

const topLevelPropsConfig = [
  "id",
  "name",
  "title",
  "subTitle",
  "altText",
  "description",
  "categories",
];

const slidesPropsConfig = [
  "type",
  "text",
  "shortText",
  "layerDescription",
  "imageCaptions",
  "caption",
  "altText",
];

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
        layers.push(
          ...json.map((layer) =>
            Object.fromEntries(
              topLevelPropsConfig
                .filter((prop) => prop in layer)
                .map((prop) => [prop, layer[prop]]),
            ),
          ),
        );
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
        stories = [...json];
      }
    } catch (e) {
      console.error(`Error reading or parsing ${mainStoriesFile}:`, e);
    }
  }

  // Append slides from story-XX-<lang>.json to stories-<lang>.json entries
  const searchableStories = stories
    .map((story) => {
      if (story.id && story.id.startsWith("story-")) {
        // Find the corresponding story-XX-<lang>.json file
        const storyFile = getAllJsonFiles(storiesDir).find((f) =>
          f.endsWith(`/${story.id}/${story.id}-${lang}.json`),
        );
        if (storyFile) {
          try {
            const storyJson = JSON.parse(fs.readFileSync(storyFile, "utf8"));

            if (storyJson.slides && Array.isArray(storyJson.slides)) {
              return { ...story, slides: [...storyJson.slides] };
            } else if (storyJson.modules) {
              const slides = storyJson.modules.flatMap(
                (module) => module.slides,
              );

              return {
                ...story,
                ...storyJson.splashscreen,
                slides: [...storyJson.splashscreen.slides, ...slides],
              };
            }
          } catch (e) {
            console.error(`Error reading or parsing ${storyFile}:`, e);
          }
        }
      }
    })
    .map((story) => {
      return {
        ...Object.fromEntries(
          topLevelPropsConfig
            .filter((prop) => prop in story)
            .map((prop) => [prop, story[prop]]),
        ),
        slides: Array.isArray(story.slides)
          ? story.slides.map((slide) =>
              Object.fromEntries(
                slidesPropsConfig
                  .filter((prop) => prop in slide)
                  .map((prop) => [prop, slide[prop]]),
              ),
            )
          : [],
      };
    });

  const outFile = path.join(storageDir, `/index/search-index-${lang}.json`);
  fs.writeFileSync(
    outFile,
    JSON.stringify({ layers, stories: searchableStories }, null, 2),
    "utf8",
  );

  console.log(
    `Merged all ${lang} stories and layers JSON files into ${outFile}`,
  );
});
