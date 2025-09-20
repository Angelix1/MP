import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { extname } from "path";
import { createHash } from "crypto";

import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@swc/core";

import os from "os";
import express from "express";

import { isProd } from "./config.js";

const extensions = [".js", ".jsx", ".mjs", ".ts", ".tsx", ".cts", ".mts"];
const PORT = 8000;

const stripVersions = (str) => str.replace(/\s?v\d+.\d+.\w+/, "");

const commonPlugins = [
	nodeResolve(),
	commonjs(),
	{
		name: "swc",
		async transform(code, id) {
			const ext = extname(id);
			if (!extensions.includes(ext)) return null;

			const ts = ext.includes("ts");
			const tsx = ts ? ext.endsWith("x") : undefined;
			const jsx = !ts ? ext.endsWith("x") : undefined;

			const result = await swc.transform(code, {
				filename: id,
				jsc: {
					externalHelpers: true,
					parser: {
						syntax: ts ? "typescript" : "ecmascript",
						tsx,
						jsx,
					},
				},
				env: {
					targets: "defaults",
					include: [
						"transform-classes",
						"transform-arrow-functions",
					],
				},
			});
			return result.code;
		},
	},
];

const minifyPlugin = esbuild({ minify: true });
const nonMinifyPlugin = esbuild({ minify: false });

async function buildPlugin(isDebug = false, NOTE, path, distro, plugins, usesKeyword = "@vendetta") {
	const files = await readdir(`./${path}`);
	for (let plug of files) {
		const manifest = JSON.parse(await readFile(`./${path}/${plug}/manifest.json`));
		const outPath = `${distro}/${plug}/index.js`;

		// await readdir("./debug").catch(() => mkdir("./debug"))
		// await readdir("./dist").catch(() => mkdir("./dist"))
		// console.log(manifest)
		try {
			const bundle = await rollup({
				input: `./${path}/${plug}/${manifest.main}`,
				onwarn: () => {},
				plugins,
			});
		
			await bundle.write({
				file: outPath,
				globals(id) {
					if (id.startsWith(usesKeyword)) return id.substring(1).replace(/\//g, ".");
					const map = {
						react: "window.React",
					};

					return map[id] || null;
				},
				format: "iife",
				compact: true,
				exports: "named",
			});
			await bundle.close();
		
			const toHash = await readFile(outPath);
			manifest.hash = createHash("sha256").update(toHash).digest("hex");
			manifest.main = "index.js";

			if(isDebug) {
				manifest.name = `[DEBUG] ${manifest.name}`;
				if(manifest?.originalName) {
					manifest.originalName = `[DEBUG] ${manifest.originalName}`;
				}
			}

			await writeFile(`${distro}/${plug}/manifest.json`, JSON.stringify(manifest));
		
			console.log(`[${isDebug ? "debug/": ""}${path}/${plug}] [${NOTE}] Successfully built ${manifest.name}!`);
		} catch (e) {
			console.error("Failed to build plugin...", e);
			process.exit(1);
		}
	}
	if(files?.length) {
		console.log(NOTE + " | Done Building");
	} else {
		console.log(NOTE + " | ENDED WITHOUT ANY FILES");
	}
}


// Build Plugin
// Debug
await buildPlugin(true, "DEBUG", "angel", "./dist/debug/angel", [...commonPlugins, nonMinifyPlugin], "@vendetta");
console.log('\n')
// Prod
await buildPlugin(false, "PRODUCTION", "angel", "./dist/angel", [...commonPlugins, minifyPlugin], "@vendetta");


// Serve if Local
if (!isProd) {
	const IPs = Object.values(os.networkInterfaces())
		.flat()
		.filter(({ family, internal }) => family === "IPv4" && !internal)
		.map(({ address }) => address);

	const app = express();

	app.use(express.static('dist'));
	app.use(express.static('debug'));

	app.listen(PORT);
	console.log(`\nServed on ${IPs[0]}:${PORT}`);

	app.get("*", (req, res) => console.log(req?.url));
}
