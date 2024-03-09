import { readFile, writeFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import { extname } from "path";
import { createHash } from "crypto";

import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@swc/core";

import os from "os"
import express from "express"

import { isProd } from "./config.js"

const extensions = [".js", ".jsx", ".mjs", ".ts", ".tsx", ".cts", ".mts"];
const PORT = 5000


/** @type import("rollup").InputPluginOption */
const plugins = [
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
	esbuild({ minify: false }),
];



// Venddy
const venddyPath = "vendetta"
for (let plug of await readdir(`./${venddyPath}`)) {
	const manifest = JSON.parse(await readFile(`./${venddyPath}/${plug}/manifest.json`));
	const distro = "./dist/vendetta"
	const outPath = `${distro}/${plug}/index.js`;

	try {
		const bundle = await rollup({
			input: `./${venddyPath}/${plug}/${manifest.main}`,
			onwarn: () => {},
			plugins,
		});
	
		await bundle.write({
			file: outPath,
			globals(id) {
				if (id.startsWith("@vendetta")) return id.substring(1).replace(/\//g, ".");
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

		await writeFile(`${distro}/${plug}/manifest.json`, JSON.stringify(manifest));
	
		console.log(`[path: vendetta/${plug}] [VENDDY] Successfully built ${manifest.name}!`);
	} catch (e) {
		console.error("Failed to build plugin...", e);
		process.exit(1);
	}
}

/*
const revengePath = "revenge"
for (let plug of await readdir(`./${revengePath}`)) {
	const manifest = JSON.parse(await readFile(`./${venddyPath}/${plug}/manifest.json`));
	const distroKid = "./dist/revenge"
	const outPath = `${distro}/${plug}/index.js`;

	try {
		const bundle = await rollup({
			input: `./plugins/${plug}/${manifest.main}`,
			onwarn: () => {},
			plugins,
		});
	
		await bundle.write({
			file: outPath,
			globals(id) {
				if (id.startsWith("@revenge")) return id.substring(1).replace(/\//g, ".");
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

		await writeFile(`${distro}/${plug}/manifest.json`, JSON.stringify(manifest));
	
		console.log(`[VENDDY] Successfully built ${manifest.name}!`);
	} catch (e) {
		console.error("Failed to build plugin...", e);
		process.exit(1);
	}
}
*/



if(!isProd) {
	const IPs = Object.values(os.networkInterfaces())
		.flat()
		.filter(({ family, internal }) => family === "IPv4" && !internal)
		.map(({ address }) => address)
	
	const app = express();

	app.use(express.static('dist'))

	app.listen(PORT)	
	console.log(`\nServed on ${IPs[0]}:${PORT}`)

	app.get("*", (req, res) => console.log(req?.url))
}