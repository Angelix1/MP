import { makeDefaults } from "../../lib/utility";
import { hash } from "./lib/lib";
import settingPage from "./settings";

import getUser from "./patches/getUser";
import getUserAvatarSource from "./patches/getUserAvatarSource";
import getUserAvatarURL from "./patches/getUserAvatarURL";

import { id, storage } from "@vendetta/plugin";
import { logger } from "@vendetta";
import { showToast } from "@vendetta/ui/toasts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { stopPlugin } from "@vendetta/plugins";


makeDefaults(storage, {
	users: {}
})

let patches = [], unpatch;
patches.push(
	getUser,
	getUserAvatarSource,
	getUserAvatarURL,
)

const patcher = () => patches.forEach((x) => x());

export let isEnabled = false;

export default {
	onLoad: () => {
		
		// console.log(hash)
		isEnabled = true
		// console.log(isEnabled)

		try {
			unpatch = patcher();
		} catch (e) {
			console.error(`[Fake Avatars] Error when Loading`);

			logger.error(`${e.stack}`);

			showToast(
				"Error When Loading",
				getAssetIDByName("Small"),
			);
			stopPlugin(id);
		}	
	},
	onunload: () => {
		isEnabled = false
		unpatch?.();
	},
	settings: settingPage
}