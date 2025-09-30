// Import Lib
import { storage, id } from "@vendetta/plugin";
import { makeDefaults } from "../../lib/utility";

// Imports
import { stopPlugin } from "@vendetta/plugins";
import { showToast } from "@vendetta/ui/toasts";
import { logger } from "@vendetta";

import ViewComponent from "./patches/ViewComponent";
import setting from "./pages/setting";

makeDefaults(storage, {
	colors: {
		online: "#3BA55C",
		idle: "#FAA81A",
		dnd: "#ED4245",
	},
	mult: 1.3,
	size: 28
})


// Export for other file to use as references
export let isEnabled = false;
export const pluginNameToast = "[Ring Indicator]";
export const getExt = url => new URL(url).pathname.split('.').pop();

// Definitions
let unpatch = null;
const patches = [
	[ViewComponent, []]
];



// Helper Definitions
const patcher = () => patches.forEach(([fn, args]) => fn(...args));


// export MAIN
export default {
	onLoad: () => {
		isEnabled = true;
		try {
			unpatch = patcher();
		}
		catch(err) {
			logger.info(`${pluginNameToast} Crash On Load.\n\n`, err)
			showToast(`${pluginNameToast} Crashing On Load. Please check debug log for more info.`)
			stopPlugin(id)		
		}
	},
	onUnload: () => {
		isEnabled = false;
        unpatch?.()
        // stopPlugin(id)
    },
	settings: setting
}