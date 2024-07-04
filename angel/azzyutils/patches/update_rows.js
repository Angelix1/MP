import { ReactNative, moment } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { isEnabled } from "..";
import { updateRowCustomMentionPatch } from "../utils/replyAlert";
import { updateRowTextMod } from "../utils/textMod";
import { patchCustomUsernameColor } from "../utils/cuc";
import { patchCustomRoleIcon } from "../utils/cri";

const { DCDChatManager } = ReactNative.NativeModules;

export const patchUpdateRowBefore = () => before("updateRows", DCDChatManager, (r) => {
	if(isEnabled) {
		let rows = JSON.parse(r[1]);
		if(storage?.debug) console.log("[AZZYUTILS update_rows.js] ========== updateRows rows ==========");
		rows.forEach((row) => {
			if(storage?.debug) console.log(row);

			updateRowCustomMentionPatch(row) // Custom Mention
			if(storage?.toggle?.customUsernameColor) patchCustomUsernameColor(row); // Custom Username Color
			if(storage?.toggle?.customRoleIcon) patchCustomRoleIcon(row); // Custom Role Icon
			// updateRowTextMod(row) // Text Color Mod

		})
		if(storage?.debug) console.log("=====================================");

		r[1] = JSON.stringify(rows);
		return r[1];		
	}
})

export const patchUpdateRowAfter = () => after("updateRows", DCDChatManager, (r) => {
	if(isEnabled) {
		let rows = JSON.parse(r[1]);

		rows.forEach((row) => {
			updateRowCustomMentionPatch(row) // Custom Mention
		})	
		
		r[1] = JSON.stringify(rows);
		return r[1];		
	}
})
