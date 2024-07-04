import { findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";

const UserStore = findByStoreName("UserStore");

export function patchCustomUsernameColor(row) {
	if(row?.message) {

		let { hex, enableReply } = storage?.utils?.customUsernameColor;	

		hex ??= "#000";
		enableReply ??= false;

		const handleColor = (mes) => {
			if(hex) mes.usernameColor = ReactNative.processColor(hex);
			return mes
		}

		if(storage?.debug) console.log("[AZZYUTILS cuc.js]", row.message.authorId, row?.message?.referencedMessage?.message?.authorId)

		if(UserStore?.getCurrentUser?.()?.id == row?.message?.authorId) 
			handleColor(row?.message);

		if(
			enableReply &&
			row?.message?.referencedMessage?.message && 
			(UserStore?.getCurrentUser?.()?.id == row?.message?.referencedMessage?.message?.authorId) 
		) {
			handleColor(row?.message?.referencedMessage?.message)
		}

		return row;
	}
}
