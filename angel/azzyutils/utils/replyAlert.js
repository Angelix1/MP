import { findByProps, findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { validateHex } from "../../../lib/utility";
import { storage } from "@vendetta/plugin";

const UserStore = findByStoreName("UserStore");
const MessageStore = findByProps("getMessage", "getMessages");


export const selfId = UserStore?.getCurrentUser?.()?.id


export function replyAlertPatch(event) {
	if(event.type == "MESSAGE_CREATE") {
		
		const check1 = (event?.message?.referenced_message?.author?.id == selfId);
		const check2 = event?.message?.mentions?.some(e => e?.id === selfId );

		if(storage?.utils?.replyAlert?.useReplyAlert) {
			if(check1 || check2) {
				
				if(event?.message?.author?.id != selfId) { 
					event.message.mentions.push({ id: selfId })
				} 
				else {
					
					// if ignoreSelf option is false, ping
					// (not using ! cuz this prefix, will says false if it null or undefined, need it to be explicit)

					if(storage?.utils?.replyAlert?.ignoreSelf == false) { 
						event.message.mentions.push({ id: selfId })
					}				
				}			
			}
		}
	}
}

export function updateRowCustomMentionPatch(row) {

	const { gutterColor, customColor, gutterAlpha, colorAlpha } = storage?.utils?.replyAlert;

	if(storage?.toggle?.customMention && row?.message?.mentioned) {
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