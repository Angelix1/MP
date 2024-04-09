import { findByProps, findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { validateHex } from "../../../lib/utility";
import { storage } from "@vendetta/plugin";

const UserStore = findByStoreName("UserStore");
const MessageStore = findByProps("getMessage", "getMessages");


export const selfId = UserStore?.getCurrentUser?.()?.id


export function replyAlertPatch(event) {
	if(event.type == "MESSAGE_CREATE") {
		// console.log(event)
		if(
			event.message?.referenced_message?.author?.id == selfId ||
			event.message?.mentions?.some(e => e?.id === selfId )
		) {
			event.message.mentions.push({ id: selfId })
		}
	}
}

export function updateRowReplyAlertPatch(row) {

	const { gutterColor, customColor, gutterAlpha, colorAlpha, useCustomColor } = storage?.utils?.replyAlert;
	/*
		const origin = MessageStore.getMessage(row?.message?.channelId, row?.message?.id);

		if(useCustomColor && origin.mentions?.some(e => e?.id === selfId )) 
	*/
	if(useCustomColor && row?.message?.mentioned) {
		row.backgroundHighlight ??= {};

		const backgroundRow = validateHex(customColor, "#DAFFFF");
		const gutterColorColor = validateHex(gutterColor, "#121212");

		row.backgroundHighlight = {
			backgroundColor: ReactNative.processColor(`${backgroundRow}${colorAlpha}`),
			gutterColor: ReactNative.processColor(`${gutterColorColor}${gutterAlpha}`)
		}
	}
	return row;
}