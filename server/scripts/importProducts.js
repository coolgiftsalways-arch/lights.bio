// Copies product photos into server/public/images/products/<slug>/ and creates the products in MongoDB.
//
// Usage (from the server folder):
//   node scripts/importProducts.js "S:\lightsBio_images\PRODUCT_MAIN_GALLERIES"
//   node scripts/importProducts.js "S:\lightsBio_images\PRODUCT_MAIN_GALLERIES" --dry   (preview, no DB)
//
// Safe to run again: products are matched by slug and updated, not duplicated.

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Edit names, prices (in paise: 49900 = ₹499), stock and descriptions here.
// `match` finds the image folder: folder name with everything except letters/digits removed, lowercased.
const PRODUCTS = [
  {
    match: (f) => f.includes("nutrition"),
    slug: "petunia-nutrition-5-pack",
    name: "Petunia Nutrition (5-Pack)",
    price: 49900,
    stock: 50,
    description: "Plant food made for glowing petunias. Five packets.",
  },
  {
    match: (f) => f.includes("fireflypetuniastartersets"),
    slug: "glowing-petunia-starter-set",
    name: "Glowing Petunia Starter Set (45mm Plants)",
    price: 249900,
    stock: 20,
    description: "Young glowing petunia plants, ready to pot up at home.",
  },
  {
    match: (f) => f.includes("trialpinkpetuniastartersets"),
    slug: "pink-petunia-starter-set",
    name: "Pink Petunia Starter Set (45mm Plants)",
    price: 199900,
    stock: 20,
    badge: "Website Exclusive",
    description: "Pink glowing petunia starter plants.",
  },
  {
    match: (f) => f.includes("trialpinkwhitepetunia"),
    slug: "pink-white-petunia-starter-set",
    name: "Pink & White Petunia Starter Set (45mm Plants)",
    price: 199900,
    stock: 20,
    badge: "Website Exclusive",
    description: "Pink and white glowing petunia starter plants.",
  },
  {
    match: (f) => f === "ceramicpot",
    slug: "ceramic-pot",
    name: "Ceramic Pot",
    price: 89900,
    stock: 30,
    description: "Minimal white ceramic pot with matching saucer.",
  },
  {
    match: (f) => f.includes("withceramicpot"),
    slug: "glowing-petunia-with-ceramic-pot",
    name: "Glowing Petunia with Ceramic Pot",
    price: 329900,
    stock: 10,
    description: "A mature glowing petunia in a white ceramic pot.",
  },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const OUT_DIR = path.join(__dirname, "..", "public", "images", "products");
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

async function main() {
  const source = process.argv[2];
  const dry = process.argv.includes("--dry");
  if (!source || !fs.existsSync(source)) {
    console.error('Give the image folder path, e.g.\n  node scripts/importProducts.js "S:\\lightsBio_images\\PRODUCT_MAIN_GALLERIES"');
    process.exit(1);
  }

  const folders = fs.readdirSync(source, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

  if (!dry) await mongoose.connect(process.env.MONGO_URI);

  const results = [];
  for (const p of PRODUCTS) {
    const folder = folders.find((f) => p.match(normalize(f)));
    if (!folder) {
      console.warn(`⚠ No image folder found for "${p.name}" — skipped`);
      continue;
    }

    // Biggest file first (the main high-res photo), skip exact duplicates
    const files = fs
      .readdirSync(path.join(source, folder))
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .map((f) => ({ f, full: path.join(source, folder, f) }))
      .map((x) => ({ ...x, size: fs.statSync(x.full).size }))
       .sort((a, b) => (a.f.toLowerCase().endsWith(".png") - b.f.toLowerCase().endsWith(".png")) || b.size - a.size);

    const seen = new Set();
    const images = [];
    const dest = path.join(OUT_DIR, p.slug);
    if (!dry) fs.mkdirSync(dest, { recursive: true });

    for (const { f, full } of files) {
      const hash = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
      if (seen.has(hash)) continue;
      seen.add(hash);
      const ext = path.extname(f).toLowerCase().replace(".jpeg", ".jpg");
      const name = `${images.length + 1}${ext}`;
      if (!dry) fs.copyFileSync(full, path.join(dest, name));
      images.push(`/images/products/${p.slug}/${name}`);
    }

    const { match, ...data } = p;
    data.images = images;

    let id = "(dry run)";
    if (!dry) {
      const doc = await Product.findOneAndUpdate({ slug: p.slug }, { $set: data }, { upsert: true, returnDocument: "after" });
      id = doc._id.toString();
    }
    results.push({ id, name: p.name, images: images.length, folder });
  }

  console.table(results);
  if (!dry) await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});