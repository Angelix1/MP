import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";

import { transform } from "../lib/index";
import * as textModule from "../lib/module";

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

		const splitters = textModule.processText(args[1].content, textModule.regexPatterns);

		const modifiedCode = textModule.modifyText(splitters, "", ENM[storage.type])

		args[1].content = modifiedCode;
	}
});