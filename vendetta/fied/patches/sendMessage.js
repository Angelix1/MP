import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";

import { transform } from "../lib/index";

const Messages = findByProps("sendMessage", "receiveMessage");

export default () => before("sendMessage", Messages, (args) => {

	const ENM = {
		"emoji": transform.emojify,
		"leet": transform.leetify,
		"spongebob": transform.spongify,
		"uwu": transform.uwu.uwuify,
		"zalgo": transform.zalgofy,
	}
	
	if(storage?.type && ENM[storage?.type]) {
		args[1].content = ENM[storage.type](args[1].content);
	}
});