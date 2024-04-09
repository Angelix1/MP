import { logger } from "@vendetta";
import { find, findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { Forms, General } from "@vendetta/ui/components";

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


export function createList(version, a = null, u = null, f = null) {
	return {
		version,
		new: a,
		updated: u,
		fix: f
	}
}

export function createToggle(id, label, subLabel = null, icon = null, def = false) {
	return { id, label, subLabel, icon, def }
}

export function createInput(id, title, type, placeholder) {
	return { id, title, type, placeholder };
}

export const UIElements = { ...General, ...Forms };

export const transparentBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII='

export function validateHex(input, defaultColor = "#000") {
	if(!input) input = defaultColor;

	const trimmedInput = input?.trim();
	if (trimmedInput.startsWith("#")) {
		const hexCode = trimmedInput.slice(1);

		if (/^[0-9A-Fa-f]{6}$/.test(hexCode)) {
			return "#" + hexCode.toUpperCase();
		}
	} 
	else {
		if (/^[0-9A-Fa-f]{6}$/.test(trimmedInput)) {
			return "#" + trimmedInput.toUpperCase();
		}
	}
	
	return defaultColor;
}

export const convert = {
	toPercentage: (decimalValue) => {
		decimalValue = Number(decimalValue)
		return (decimalValue === 0) ? 0 : (decimalValue === 1) ? 100 : Math.round(decimalValue * 100);
	},
	toDecimal: (percentageValue) => {
		percentageValue = Number(percentageValue)
		const clampedPercentage = Math.min(Math.max(percentageValue, 0), 100);
		return clampedPercentage === 0 ? 0 : clampedPercentage === 100 ? 1 : clampedPercentage / 100;
	},
	formatDecimal: (decimalValue) => {
		decimalValue = Number(decimalValue)
		return (decimalValue === 0 || decimalValue === 1) ? decimalValue : decimalValue.toFixed(2);
	},
	alphaToHex: (percentageValue) => {
		percentageValue = Number(percentageValue)
		const clampedPercentage = Math.min(Math.max(percentageValue, 0), 100);
		const hexValue = Math.round((clampedPercentage / 100) * 255).toString(16).toUpperCase();
		return hexValue.length === 1 ? '0' + hexValue : hexValue;
	},
	hexAlphaToPercent: (hexAlpha) => {
		const decimalAlpha = parseInt(hexAlpha, 16);
		if (isNaN(decimalAlpha)) {
			return 0; // Handle invalid input
		}
		return Math.round((decimalAlpha / 255) * 100);
	}
};


export function withinChance(percentage) {
	if (typeof percentage !== 'number' || percentage < 1 || percentage > 100) {
	
	throw new Error('withinChance(percentage): percentage must be a number between 1 and 100');
	}

	const random = Math.random();
	return random < percentage / 100;
}