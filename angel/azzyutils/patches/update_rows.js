import { ReactNative, moment } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { ctimePatch, renderTimestamp } from "../utils/customTimestamp";
import { storage } from "@vendetta/plugin";
import { isEnabled } from "..";

const { DCDChatManager } = ReactNative.NativeModules;

export const patchUpdateRowBefore = () => before("updateRows", DCDChatManager, (r) => {
	if(isEnabled) {
		let rows = JSON.parse(r[1]);

		rows.forEach((row) => {		
			ctimePatch.beforePatch(row, moment) // Custom TimeStamp

		})

		r[1] = JSON.stringify(rows);
		return r[1];		
	}
})

export const patchUpdateRowAfter = () => after("updateRows", DCDChatManager, (r) => {
	if(isEnabled) {
		let rows = JSON.parse(r[1]);

		rows.forEach((row) => {
			ctimePatch.afterPatch(row) // Custom TimeStamp
		})	
		
		r[1] = JSON.stringify(rows);
		return r[1];		
	}
})
