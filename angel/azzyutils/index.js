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
import { FluxDispatcher } from "@vendetta/metro/common";

makeDefaults(storage, {
	toggle: {
		ctime: false,
		ralert: false,
		customMention: false,
		notype: false,
		quickid: false,
		eml: false,
		noshare: false,
		removeDecor: false,
		cactus: false,
		customUsernameColor: false,
		customRoleIcon: false,
		customClan: false,		
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
		},
		customUsernameColor: {
			hex: "#FFFFFF",
			enableReply: false,
		},
		customRoleIcon: {
			name: "BlobCatSip",
			source: 'https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512',
			size: 18
		},
		customClan: {
			icon: "",
			tag: ""
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
	beforeStartEdit,
	beforeEdit,
	getUser,
	sendMessage,
)

const patcher = () => patches.forEach((x) => x());

const unLoadDatas = () => {
	storage.utils.eml.editedMsg.forEach(savedMsg => {
		FluxDispatcher.dispatch({
			type: "MESSAGE_UPDATE",
			message: savedMsg,
			otherPluginBypass: true
		})
	})

	storage.utils.eml.editedMsg = [];
}

export default {
	onLoad: () => {
		isEnabled = true
		if(storage?.toggle?.notype) {	
			patches.push(startTyping, stopTyping)
		}
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