import { FluxDispatcher } from "@vendetta/metro/common"
import { before } from "@vendetta/patcher"
import { storage } from "@vendetta/plugin"

import { replyAlertPatch } from "../utils/replyAlert"
import { isEnabled } from ".."


export default () => before("dispatch", FluxDispatcher, ([event]) => {
	if(isEnabled) {
		replyAlertPatch(event); // ReplyAlert		
	}
})