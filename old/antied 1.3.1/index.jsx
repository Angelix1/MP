import { makeDefaults } from "../../lib/utility";

import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";
import updateRowsPatch from "./patches/update_rows";
import createMessageRecord from "./patches/createMessageRecord";
import messageRecordDefault from "./patches/messageRecordDefault";
import updateMessageRecord from "./patches/updateMessageRecord";

import { FluxDispatcher } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { plugin } from "@vendetta";
import { findByProps } from '@vendetta/metro';
import * as Assets from "@vendetta/ui/assets";

import actionsheet from "./patches/actionsheet";
import SettingPage from "./Settings";

const ChannelMessages = findByProps("_channelMessages");

export const regexEscaper = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const stripVersions = (str) => str.replace(/\s?v\d+.\d+.\w+/, "");
export const vendettaUiAssets = Object.keys(Assets.all).map(x => x?.name)


makeDefaults(storage, {
	setting: {
		colorpick: false,
		customize: false,
		ingorelist: false,
		patches: false,
		text: false,
		timestamp: false,
	},
	switches: {
		customizeable: false,
		enableMD: true,
		enableMU: true,
		useBackgroundColor: false,
		useSemRawColors: false,
		ignoreBots: false,
		minimalistic: true,
		alwaysAdd: false,
		darkMode: true,
		removeDismissButton: false,
		addTimestampForEdits: false,
		timestampStyle: 'R',
		useEphemeralForDeleted: true		
	},
	colors: {
		textColor: "#E40303",
		backgroundColor: "#FF2C2F",
		backgroundColorAlpha: "33",
		gutterColor: "#FF2C2F",
		gutterColorAlpha: "CC",
		semRawColorPrefix: "semanticColors.TEXT_BRAND",
	},
	inputs: {
		deletedMessageBuffer: "This message is deleted",
		editedMessageBuffer: "`[ EDITED ]`",
		historyToast: "[ANTI ED] History Removed",
		ignoredUserList: [],
		customPluginName: (plugin?.manifest?.name || "ANTIED")
	},
	misc: {
		timestampPos: "BEFORE", // BEFORE|AFTER
		editHistoryIcon: "ic_edit_24px"
	},
	debug: false
})

let deletedMessageArray = {};
const patches = []

export default {
	onLoad: () => {
		patches.push(
			fluxDispatchPatch(deletedMessageArray),
			updateRowsPatch(deletedMessageArray),
			selfEditPatch(),
			createMessageRecord(),
			messageRecordDefault(),
			updateMessageRecord(),
			actionsheet(deletedMessageArray)	
		)
		
		if(plugin?.manifest?.name != storage?.inputs?.customPluginName) {
			plugin.manifest.name = storage?.inputs?.customPluginName
		}
	},
	onUnload: () => {
        
        for (const unpatch of patches) {
            unpatch();
        }

		if(plugin?.manifest?.name != storage?.inputs?.customPluginName) {
			plugin.manifest.name = storage?.inputs?.customPluginName
		}

		for (const channelId in ChannelMessages._channelMessages) {
			for (const message of ChannelMessages._channelMessages[channelId]._array) {
				if(message.was_deleted) {
					FluxDispatcher.dispatch({
						type: "MESSAGE_DELETE",
						id: message.id,
						channelId: message.channel_id,
						otherPluginBypass: true,
					});
				}
			}
		}
	},
	settings: SettingPage
}