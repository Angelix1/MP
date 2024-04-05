import settingPage from "./settings"
import { makeDefaults } from "../../lib/utility";

import fluxDispatch from "./patches/flux_dispatcher";
import { patchUpdateRowBefore, patchUpdateRowAfter } from "./patches/update_rows";
import { startTyping, stopTyping } from "./utils/noTyping";
import { beforeEdit, beforeStartEdit } from "./patches/editMessage";
import actionSheet from "./patches/actionSheet";
import { storage } from "@vendetta/plugin";

makeDefaults(storage, {
	toggle: {
		ctime: false,
		ralert: false,
		notype: false,
		quickid: false,
		eml: false,
		noshare: false
	},
	utils: {
		customTimestamp: {
			selected: "calendar",
			customFormat: "dddd, MMMM Do YYYY, h:mm:ss a",
			separateMessages: false
		},
		replyAlert: {
			customColor: "#000",
			useCustomColor: false
		},
		eml: {
			logEdit: false,
		}
	},
	debug: false
})

let patches = [], unpatch;

export let isEnabled = false;

patches.push(
	actionSheet,
	fluxDispatch,
	patchUpdateRowBefore,
	patchUpdateRowAfter,
	startTyping,
	stopTyping,
	beforeStartEdit,
	beforeEdit,
)

const patcher = () => patches.forEach((x) => x());

export default {
	onLoad: () => {
		isEnabled = true		
		unpatch = patcher();
	},
	onUnload: () => {
		isEnabled = false
		unpatch();
	},
	settings: settingPage
}