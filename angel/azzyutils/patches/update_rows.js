import { ReactNative, moment } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { isEnabled } from "..";
import { updateRowReplyAlertPatch } from "../utils/replyAlert";

const { DCDChatManager } = ReactNative.NativeModules;

export const patchUpdateRowBefore = () => before("updateRows", DCDChatManager, (r) => {
	if(isEnabled) {
		let rows = JSON.parse(r[1]);

		rows.forEach((row) => {		
			updateRowReplyAlertPatch(row) // ReplyAlert

		})

		r[1] = JSON.stringify(rows);
		return r[1];		
	}
})

export const patchUpdateRowAfter = () => after("updateRows", DCDChatManager, (r) => {
	if(isEnabled) {
		let rows = JSON.parse(r[1]);

		rows.forEach((row) => {
			updateRowReplyAlertPatch(row) // ReplyAlert
		})	
		
		r[1] = JSON.stringify(rows);
		return r[1];		
	}
})
