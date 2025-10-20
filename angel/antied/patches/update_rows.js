/*
	Time wasted: 3 hours 27 minutes


	Alternative Function: findByName("ChatManager").prototype => "createRow"
*/

import { ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { findByProps } from '@vendetta/metro';
import { showToast } from "@vendetta/ui/toasts";

import { isEnabled } from "..";

const rowsController = findByProps("updateRows", "getConstants") || findByProps("updateRows");

if (!rowsController) {
  console.error('[ANTIED] rowsController not found – patch will not be applied');
}

const logger = (...a) => {
	if(false) {
		console.log(...a)
	}
};

export default deletedMessagesArray => before("updateRows", rowsController, function (args) {
	if(isEnabled) {

		/* ---------- Fail-fast guards ---------- */
		if (!args?.length) return;
		const raw = args[1];
		if (!raw) return;

		/* ---------- Parse rows once ---------- */
		let rows;
		let isString = false;
		if (typeof raw === 'string') {
			try { rows = JSON.parse(raw); isString = true; }
			catch { return; } // garbage = bail
		} 
		else if (Array.isArray(raw)) {
			rows = raw;
		} 
		else {
			return; // unsupported shape
		}

		/* ---------- Nothing to paint? we GOEENN ---------- */
		const hasDeleted = rows.some(r => r?.message && deletedMessagesArray.has(r.message.id));
		if (!hasDeleted) return;

		/* ---------- Cache storage once ---------- */
		const {
			colors: { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha },
			switches: { useBackgroundColor, minimalistic, removeDismissButton, overrideIndicator, useIndicatorForDeleted, useEphemeralForDeleted },
			inputs: { deletedMessageBuffer, customIndicator }
		} = storage;

		/* ---------- Helpers ---------- */
		const toHex = (v, fallback) => {
			const s = String(v || '').trim();
			const hex = s.startsWith('#') ? s.slice(1) : s;
			return /^[0-9a-fA-F]{6}$/.test(hex) ? `#${hex.toUpperCase()}` : fallback;
		};

		const bufferSymbol = ' • ';

		/* ---------- Mutate rows bery kewl ---------- */
		for (const row of rows) {
			if (row?.type !== 1) continue;
			
			const msg = row.message;
			if (!msg || !deletedMessagesArray.has(msg.id)) continue;

			/* ---- indicator ---- */
			if (useIndicatorForDeleted && useEphemeralForDeleted) {
				msg.ephemeralIndication.content[0].content = `${deletedMessageBuffer}${bufferSymbol}  `;
			} 
			else if (deletedMessageBuffer) {
				msg.edited = deletedMessageBuffer;
			}

			/* ---- text colour ---- */
			if (!minimalistic) {
				msg.textColor = ReactNative.processColor(toHex(textColor, '#E40303'));
			}

			/* ---- ephemeralIndication tweaks ---- */
			if (overrideIndicator) {
				msg.ephemeralIndication.content = [];
			} 
			else if (!useIndicatorForDeleted && customIndicator) {
				msg.ephemeralIndication.content[0].content = `${customIndicator}  `;
			}

			if (removeDismissButton && msg.ephemeralIndication?.content) {
				msg.ephemeralIndication?.content?.splice?.(1, 1);
			}

			/* ---- background highlight ---- */
			if (!minimalistic && useBackgroundColor) {
				row.backgroundHighlight = {
					backgroundColor: ReactNative.processColor(toHex(backgroundColor, '#FF2C2F') + backgroundColorAlpha),
					gutterColor:   ReactNative.processColor(toHex(gutterColor,   '#FF2C2F') + gutterColorAlpha)
				};
			}
		}

		/* ---------- Put back if originally was string ---------- */
		if (isString) args[1] = JSON.stringify(rows);
		else args[1] = rows;

		/* else args[1] was mutated in place sooooo nothing to do */

		return args;

	}

});


/*
// Left over code from version before 235.xx, for later use case if this plugin use native modification
// might be useful who know and i dont want to recode it back if it needed

function transformObject(obj, inputColor) {
	const charColor = inputColor?.toString();
	const compTypes = [
		"text",
		"heading",
		"s",
		"u",
		"em",
		"strong",
		"list",
		"blockQuote"
	];

	if (Array.isArray(obj)) {
		return obj.map(data => transformObject(data, charColor));
	} 
	else if (typeof obj === "object" && obj !== null) {
		const { content, type, target, items } = obj;

		if(!compTypes.includes(type)) return obj;

		if (type === "text" && content && content.length >= 1) {
			return {
				content: [{ content: content, type: "text"}],
				target: "usernameOnClick",
				type: "link",
				context: {
					username: 1,
					medium: true,
					usernameOnClick: {
						action: "0",
						userId: "0",
						linkColor: ReactNative.processColor(charColor),
						messageChannelId: "0"
					}
				}
			};
		}

		const updatedContent = transformObject(content, charColor);
		const updatedItems = items ? items.map(transformObject, charColor) : undefined;

		if (updatedContent !== content || updatedItems !== items || !compTypes.includes(type)) {
			const updatedObj = { ...obj, content: updatedContent };

			if (type === "blockQuote" && target) {
				updatedObj.content = updatedContent;
				updatedObj.target = target;
			}

			if (type === "list") {
				if (updatedObj?.content) {
					delete updatedObj.content;
				}
			}

			if (items) {
				updatedObj.items = updatedItems;
			}

			return updatedObj;
		}
	}

	return obj;
}


*/