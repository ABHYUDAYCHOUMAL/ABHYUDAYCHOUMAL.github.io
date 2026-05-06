#!/usr/bin/env node
/**
 * Compress public/avatar.glb in place using Draco geometry compression
 * + texture downsizing. Typical 4–5 MB Avaturn export → 600–900 KB.
 *
 * Run with: node scripts/optimize-avatar.mjs
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from "@gltf-transform/extensions";
import {
  draco,
  textureCompress,
  prune,
  dedup,
  weld,
  resample,
} from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import sharp from "sharp";
import { writeFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const SRC = resolve("public/avatar.glb");
const OUT = resolve("public/avatar.glb");

const before = statSync(SRC).size;

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });

const document = await io.read(SRC);

// Required for the Draco extension to be writable.
document.createExtension(KHRDracoMeshCompression).setRequired(true);

await document.transform(
  prune(),
  dedup(),
  resample(),
  weld(),
  // Geometry: Draco edge-breaker compression shrinks vertex/index data
  // by ~10x at default quality.
  draco({
    method: "edgebreaker",
    encodeSpeed: 5,
    decodeSpeed: 5,
  }),
  // Textures: re-encode as WebP at moderate quality and cap dimensions
  // to 1024 px. This is where the bulk of the GLB size lives.
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    quality: 78,
    resize: [1024, 1024],
  })
);

const buffer = await io.writeBinary(document);
writeFileSync(OUT, buffer);

const after = statSync(OUT).size;
const pct = (((before - after) / before) * 100).toFixed(1);
const fmt = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
console.log(`avatar.glb: ${fmt(before)} → ${fmt(after)} (-${pct}%)`);
