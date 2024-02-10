/* Severe barin damage */ 
/* Only gawd know what the fucj therse kode does */

import { before, after } from "@vendetta/patcher";
import { ReactNative } from "@vendetta/metro/common"
import { find, findByProps, findByStoreName, findByName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { DCDChatManager } = ReactNative.NativeModules;

export default () => before("updateRows", DCDChatManager, (args) => {
	let rows = JSON.parse(args[1]);

	for (const row of rows) {
		const { message } = row
		if(!message) continue;

		function handleUpdate(m) {
			if(
				storage?.imageURL && 
				(storage?.imageURL?.length > 0) && 
				(storage?.imageURL != "") &&
				storage?.imageURL?.startsWith('http')
			) {

				let sanitizedLinkies = storage?.imageURL;
				const urlObj = new URL(sanitizedLinkies);
				if(urlObj?.search) {
					sanitizedLinkies = sanitizedLinkies?.replace(urlObj.search, "");
				}
				m.avatarURL = sanitizedLinkies;
			}				
			if(storage?.username && (storage?.username?.length > 0) && (storage?.username != "")) {
				m.username = storage?.username?.toString?.();
			}				
			if(storage?.tagText && (storage?.tagText?.length > 0) && (storage?.tagText != "")) {
				m.tagText = storage?.tagText?.toString?.();
			}

			if(m?.referencedMessage?.message) {
				handleUpdate(m.referencedMessage.message);
			}
		}

		handleUpdate(message)
	}

	args[1] = JSON.stringify(rows);
})
