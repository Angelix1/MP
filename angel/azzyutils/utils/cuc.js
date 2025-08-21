import { findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { colorConverter } from "../../../lib/utility";

const UserStore = findByStoreName("UserStore");

export function patchCustomUsernameColor(row) {
	if(row?.message) {

		if(storage?.debug) {
			const a = [
				"editedColor",
				"textColor",
				"linkColor",
				"opTagTextColor",
				"opTagBackgroundColor",
				"usernameColor",
				"roleColor",
				"roleColors",
				"colorString",
				"feedbackColor",
				"highlightColor",
				"clanTag", // Those 4 letters
				"clanBadgeUrl",
			]

			for(let v of a) {
				console.log(
					`\n========= [${v}] ---`, 
					row?.message?.[v], 
					"\n",
					(row?.message?.[v] != undefined || row?.message?.[v] != null) ? colorConverter.toHex(row?.message?.[v]) : "None",
					"\n"
				)
			}
		}

		let { hex, hex2, enableReply } = storage?.utils?.customUsernameColor;

		hex ??= "#000";
		hex2 ??= "#FFF";
		enableReply ??= false;

		const handleColor = (mes) => {
			if(hex) {
				mes.usernameColor = ReactNative.processColor(hex);
				mes.roleColor = ReactNative.processColor(hex);

				if(hex2) {
					mes.roleColors = { 
						primaryColor: ReactNative.processColor(hex), 
						secondaryColor: ReactNative.processColor(hex2) 
					}
				}
			}
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
