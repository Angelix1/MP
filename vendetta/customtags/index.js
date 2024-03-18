import { storage } from "@vendetta/plugin";
import { i18n } from "@vendetta/metro/common";
import { rawColors } from "@vendetta/ui";

import patchChat from "./patches/chat";
import patchDetails from "./patches/details";
import patchName from "./patches/name";
import patchSidebar from "./patches/sidebar";
import patchTag from "./patches/tag";
import Settings from "./settings";


import { makeDefaults } from "../../lib/utility";


makeDefaults(storage, {
	toggle: {
		useDefaultTag: true,
		useRoleColor: false,
		useCustomTags: false,
		debug: false
	},
	builtInReplace: [
		{
			text: "WEBHOOK",
			condition: (guild, channel, user) => user.isNonUserBot()
		},
		{
			text: "OWNER",
			backgroundColor: rawColors.ORANGE_345,
			condition: (guild, channel, user) => guild?.ownerId === user.id
		},
		{
			text: i18n.Messages.BOT_TAG_BOT,
			condition: (guild, channel, user) => user.bot,
			verified: (guild, channel, user) => user.isVerifiedBot()
		},
	],
	builtInDefault: [
		{
			text: "ADMIN",
			backgroundColor: rawColors.RED_560,
			permissions: ["ADMINISTRATOR"]
		},
		{
			text: "MANAGER",
			backgroundColor: rawColors.GREEN_345,
			permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
		},
		{
			text: "MOD",
			backgroundColor: rawColors.BLUE_345,
			permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]
		}
	],
	customTags: []
})


let patches = [];

export default {
	onLoad: () => {
		patches.push(patchChat())
		patches.push(patchTag())
		patches.push(patchName())
		patches.push(patchSidebar())
		patches.push(patchDetails())
	},
	onUnload: () => patches.forEach(unpatch => unpatch()),
	settings: Settings
}