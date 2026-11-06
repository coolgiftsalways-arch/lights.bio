const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const publicFolder = path.join(root, "public");

const imageFolder = path.join(publicFolder, "LightBio");
const videoFolder = path.join(publicFolder, "LightBioVideo");

const outputFolder = path.join(root, "src", "data");
const outputFile = path.join(outputFolder, "galleryFiles.json");

const imageExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
  ".heic",
]);

const videoExtensions = new Set([
  ".mp4",
  ".webm",
  ".mov",
  ".m4v",
  ".ogg",
  ".avi",
  ".mkv",
  ".mpeg",
  ".mpg",
  ".3gp",
]);

function scanFolder(folder, extensions) {
  if (!fs.existsSync(folder)) {
    console.log("❌ Folder does not exist:", folder);
    return [];
  }

  console.log("✅ Folder found:", folder);

  const found = [];

  function scan(currentFolder) {
    for (const item of fs.readdirSync(currentFolder, {
      withFileTypes: true,
    })) {
      const fullPath = path.join(currentFolder, item.name);

      if (item.isDirectory()) {
        scan(fullPath);
      } else if (
        item.isFile() &&
        extensions.has(path.extname(item.name).toLowerCase())
      ) {
        const relative = path.relative(publicFolder, fullPath);
        found.push("/" + relative.replace(/\\/g, "/"));
      }
    }
  }

  scan(folder);
  return found.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

const images = scanFolder(imageFolder, imageExtensions);
const videos = scanFolder(videoFolder, videoExtensions);

fs.mkdirSync(outputFolder, { recursive: true });

fs.writeFileSync(
  outputFile,
  JSON.stringify({ images, videos }, null, 2),
  "utf8",
);

console.log("\n========== GALLERY RESULT ==========");
console.log("Images found:", images.length);
console.log("Videos found:", videos.length);
console.log("JSON saved:", outputFile);
console.log("====================================");
