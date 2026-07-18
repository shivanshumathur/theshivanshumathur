import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://www.igloo.inc";
const ROOT = __dirname;

const DRC = [
  "ground.drc", "mountain.drc", "igloo.drc", "floor.drc", "blurrytext.drc",
  "blurrytext_cylinder.drc", "ceilingsmoke.drc", "intro_particles.drc",
  "shattered_ring.drc", "shattered_ring_smoke.drc", "shattered_ring2.drc",
  "smoke_trail.drc", "igloo/igloo_cage.drc", "igloo/igloo_outline.drc",
  "igloo/patch.drc", "cubes/background_shapes.drc",
];

const IMAGES = [
  "scroll-datatexture.ktx2", "frost-datatexture.ktx2", "wind_noise.ktx2",
  "bokeh.ktx2", "caustics.ktx2", "clouds_noise.ktx2", "mosaic.ktx2",
  "shapes_blurred.ktx2", "numbers-datatexture.ktx2", "perlin-datatexture.ktx2",
  "perlin-datatexture.png", "floor_color.ktx2", "cubes_env.exr",
  "noises/blue-8-128-rgb.ktx2", "igloo/ground_color.ktx2",
  "igloo/ground_glow.ktx2", "igloo/ground_sansigloo_color.ktx2",
  "igloo/igloo_color.ktx2", "igloo/igloo_exploded_color.ktx2",
  "igloo/igloo_scene.ktx2", "igloo/mountain_color.ktx2", "igloo/numbers.ktx2",
  "igloo/triangles_tiling.ktx2", "cubes/advect.png", "cubes/bg.png",
  "cubes/blurrytext_atlas.ktx2", "cubes/cube_scene.ktx2",
  "cubes/dot_pattern.ktx2", "ui/arrow-datatexture.ktx2",
  "ui/close-datatexture.ktx2", "ui/logo-datatexture.ktx2",
  "ui/sound-datatexture.ktx2",   "ui/visit-datatexture.ktx2",
  "shattered_ring_color.ktx2", "shattered_ring_ao.ktx2",
  "shattered_ring2_color.ktx2", "shattered_ring2_ao.ktx2",
  "social.jpg",
];

const CORE = [
  "index.html",
  "assets/index-2eb69c09.js",
  "assets/App3D-f554a111.js",
  "assets/audioworker-036a09db.js",
  "assets/bitmapworker-046527f8.js",
  "assets/exrworker-41cbee65.js",
  "assets/msdfworker-ac346fa7.js",
  "assets/favicon32-af94112f.png",
  "assets/favicon16-9e4401be.png",
  "assets/IBMPlexMono-Medium-897c8c30.woff2",
  "assets/IBMPlexMono-Medium-1e253194.woff",
  "assets/IBMPlexMono-Regular-d3034935.woff2",
  "assets/IBMPlexMono-Regular-419d45f6.woff",
  "assets/fonts/IBMPlexMono-Medium-datatexture.ktx2",
  "assets/fonts/IBMPlexMono-Medium.json",
  "assets/libs/draco/draco_decoder.js",
  "assets/libs/draco/draco_decoder.wasm",
  "assets/libs/draco/draco_wasm_wrapper.js",
  "assets/libs/basis/basis_transcoder.js",
  "assets/libs/basis/basis_transcoder.wasm",
  "assets/audio/beeps.ogg", "assets/audio/beeps2.ogg", "assets/audio/beeps3.ogg",
  "assets/audio/circles.ogg", "assets/audio/click-project.ogg",
  "assets/audio/enter-project.ogg", "assets/audio/igloo.ogg",
  "assets/audio/leave-project.ogg", "assets/audio/logo.ogg",
  "assets/audio/manifesto.ogg", "assets/audio/music-highq.ogg",
  "assets/audio/particles.ogg", "assets/audio/project-text.ogg",
  "assets/audio/room.ogg", "assets/audio/shard.ogg",
  "assets/audio/ui-long.ogg", "assets/audio/ui-short.ogg",
  "assets/audio/wind.ogg",
];

const FILES = [
  ...CORE,
  ...DRC.map((f) => `assets/geometries/${f}`),
  ...IMAGES.map((f) => `assets/images/${f}`),
];

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} -> HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const buf = Buffer.concat(chunks);
          const ct = res.headers["content-type"] || "";
          if (ct.includes("text/html")) {
            reject(new Error(`${url} returned HTML (wrong path)`));
            return;
          }
          resolve(buf);
        });
      })
      .on("error", reject);
  });
}

function patchFiles() {
  const indexJs = path.join(ROOT, "assets/index-2eb69c09.js");
  let content = fs.readFileSync(indexJs, "utf8");
  content = content.replace(
    /ht=function\(t\)\{return"https:\/\/www\.igloo\.inc\/"\+t\}/,
    'ht=function(t){return"/"+t}'
  );
  content = content.replace(/https:\/\/www\.igloo\.inc\/assets\//g, "/assets/");
  fs.writeFileSync(indexJs, content);

  const appJs = path.join(ROOT, "assets/App3D-f554a111.js");
  let app = fs.readFileSync(appJs, "utf8");
  app = app.replace(/https:\/\/www\.igloo\.inc\//g, "/");
  fs.writeFileSync(appJs, app);

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/><link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon32-af94112f.png"><link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon16-9e4401be.png"><meta name="description" content="Our mission is to create the largest onchain community, driving the consumer crypto revolution."><title>Igloo Inc.</title><script type="module" crossorigin src="/assets/index-2eb69c09.js"></script></head><body></body></html>`;
  fs.writeFileSync(path.join(ROOT, "index.html"), html);
}

async function main() {
  let ok = 0;
  let fail = 0;
  for (const file of FILES) {
    const dest = path.join(ROOT, file);
    const url = `${BASE}/${file.replace(/\\/g, "/")}`;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      process.stdout.write(`GET ${file}... `);
      const data = await download(url);
      fs.writeFileSync(dest, data);
      console.log(`${data.length} bytes`);
      ok++;
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      fail++;
    }
  }
  patchFiles();
  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}

main();
