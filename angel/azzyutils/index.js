import { id, storage } from "@vendetta/plugin";

import settingPage from "./settings"
import { makeDefaults } from "../../lib/utility";

import fluxDispatch from "./patches/flux_dispatcher";
import actionSheet from "./patches/actionSheet";
import { patchUpdateRowBefore, patchUpdateRowAfter } from "./patches/update_rows";
import { startTyping, stopTyping } from "./utils/noTyping";
import { beforeEdit, beforeStartEdit } from "./patches/editMessage";
import { getUser } from "./patches/getUser";
import { stopPlugin } from "@vendetta/plugins";
import sendMessage from "./patches/sendMessage";

makeDefaults(storage, {
	toggle: {
		ctime: false,
		ralert: false,
		notype: false,
		quickid: false,
		eml: false,
		noshare: false,
		removeDecor: false,
		cactus: false,
	},
	utils: {
		cactus: {
			name: "",
		},
		quickid: {
			addID: false,
			addMention: false,
			addCombine: false
		},
		replyAlert: {
			customColor: "#000",
			gutterColor: "#FFF",
			colorAlpha: "33",
			gutterAlpha: "33",
			useReplyAlert: false,
			useCustomColor: false,
			ignoreSelf: false
		},
		eml: {
			logEdit: false,
			editedMsg: []
		},
		noshare: {
			addSaveImage: false,
			addCopyImage: false
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
	getUser,
	sendMessage,
)

const patcher = () => patches.forEach((x) => x());

const unLoadDatas = () => {
	storage.utils.eml.editedMsg = [];	
}

export default {
	onLoad: () => {
		isEnabled = true		
		unpatch = patcher()?.catch(err => {
			console.log("AZZYUTIL, Crash On Load")
			console.log(err)
			stopPlugin(id);		
		});
	},
	onUnload: () => {
		isEnabled = false
		unpatch();
		unLoadDatas();
	},
	settings: settingPage
}