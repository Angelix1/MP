import { logger } from "@vendetta";
import { find, findByName, findByProps, findByStoreName } from "@vendetta/metro";

const { openLazy, hideActionSheet } = findByProps("openLazy", "hideActionSheet");

export function makeDefaults(object, defaults) {
	if (object != undefined) {
		if (defaults != undefined) {
			for (const key of Object.keys(defaults)) {
				if (typeof defaults[key] === "object" && !Array.isArray(defaults[key])) {
					if (typeof object[key] !== "object") object[key] = {};
					makeDefaults(object[key], defaults[key]);
				} 
				else {
					object[key] ??= defaults[key];
				}
			}
		}
	}
}

export function openSheet(sheet, props) {
	try {
		openLazy(
			new Promise((call) => call({ default: sheet })),
			"ActionSheet",
			props
			);
	} 
	catch (e) {
		logger.error(e.stack);
		showToast(
			"Got error when opening ActionSheet! Please check debug logs"
			);
	}
}

export function calculateLighterValue(mainValue, increment) {
	let secondaryValue = mainValue + increment;
	secondaryValue = Math.min(secondaryValue, 255);

	const mainHex = mainValue.toString(16).padStart(2, '0');
	const secondaryHex = secondaryValue.toString(16).padStart(2, '0');

	return { main: mainHex, secondary: secondaryHex };
}

export const setOpacity = (hex, alpha) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;

export const colorConverter = {
	toInt(hex) {		
		hex = hex.replace(/^#/, '');
		return parseInt(hex, 16);
	},
	toHex(integer) {
		const hex = integer.toString(16).toUpperCase();
		return "#" + hex;
	},
	HSLtoHEX(h, s, l) {
		l /= 100;
		const a = s * Math.min(l, 1 - l) / 100;
		const f = n => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}
};

export function numToHex(numericColor) {
	const red = (numericColor >> 16) & 255;
	const green = (numericColor >> 8) & 255;
	const blue = numericColor & 255;
	return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
}