import { makeDefaults } from "~lib/utility";

import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";
import updateRowsPatch from "./patches/update_rows";
import createMessageRecord from "./patches/createMessageRecord";
import messageRecordDefault from "./patches/messageRecordDefault";
import updateMessageRecord from "./patches/updateMessageRecord";

import { FluxDispatcher } from "@vendetta/metro/common";
import { storage, id } from "@vendetta/plugin";
import { logger, plugin } from "@vendetta";
import { findByProps, findByStoreName } from '@vendetta/metro';
import * as Assets from "@vendetta/ui/assets";
import { removePlugin, stopPlugin } from "@vendetta/plugins";
import { showToast } from "@vendetta/ui/toasts";

import actionsheet from "./patches/actionsheet";
import SettingPage from "./Settings";
import { fetchDB, selfDelete } from "~lib/func/bl";

const ChannelMessages = findByProps("_channelMessages");

export const regexEscaper = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const stripVersions = (str) => str.replace(/\s?v\d+.\d+.\w+/, "");
export const vendettaUiAssets = Object.keys(Assets.all).map(x => x?.name)
export let isEnabled = false;

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
		useEphemeralForDeleted: true,
		overrideIndicator: false,
		useIndicatorForDeleted: false,
		useCustomPluginName: false
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
		customPluginName: (plugin?.manifest?.name || "ANTIED"),
		customIndicator: ""
	},
	misc: {
		timestampPos: "BEFORE", // BEFORE|AFTER
		editHistoryIcon: "ic_edit_24px"
	},
	debug: false,
	debugUpdateRows: false
})

const deletedMessageArray = new Map();
let unpatch = null;

// these value are hardocoded simply i dont trust users would actively keep it low. for their own sake tbf
// old code doesnt have cache limit crash things, yet you expect me makes it customizeable?
let intervalPurge;
const KEEP_NEWEST = 10;                     // how many we want to keep (newest entry on the list)
const DELETE_EACH_CYCLE = 140;              // how many we purge for each cycle

// [Function, ArrayOfArguments]
const patches = [
	[fluxDispatchPatch,   	[deletedMessageArray]],
	[updateRowsPatch,     	[deletedMessageArray]],
	[selfEditPatch,       	[]],                 	// no args
	[createMessageRecord, 	[]],
	[messageRecordDefault,	[]],
	[updateMessageRecord, 	[]],
	[actionsheet,         	[deletedMessageArray]]
];

// helper func
const patcher = () => patches.forEach(([fn, args]) => fn(...args));

const database = "https://angelix1.github.io/static_list/antied/list.json";


export default {
	onLoad: async () => {

		const databaseData = await fetchDB(database);

		selfDelete(databaseData, 15) // 15 sec

		isEnabled = true;
		try {
			unpatch = patcher()
		}
		catch(err) {
			logger.info("[ANTIED], Crash On Load.\n\n", err)
			showToast("[ANTIED], Crashing On Load. Please check debug log for more info.")
			stopPlugin(id)		
		};

		intervalPurge = setInterval(() => {
			if (deletedMessageArray.size <= KEEP_NEWEST) return;

			const toDelete = Math.min(DELETE_EACH_CYCLE, deletedMessageArray.size - KEEP_NEWEST);
			let i = 0;

			for (const key of deletedMessageArray.keys()) {
				deletedMessageArray.delete(key);
				if (++i >= toDelete) break;
			}
		}, 15 * 60 * 1000);  // 15 min check to purge caches

		// apply custom name if override enabled
		plugin.manifest.name = storage?.switches?.useCustomPluginName ? 
			storage?.inputs?.customPluginName : 
			plugin?.manifest?.name;

	},
	onUnload: () => {
		isEnabled = false;
        
		clearInterval(intervalPurge);
        
        unpatch?.()

        // cleaning records
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