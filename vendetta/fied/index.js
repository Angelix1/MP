import chatThing from "./patches/sendMessage";
import settingPage from "./settings";
import { makeDefaults } from "../../lib/utility";
import { storage } from "@vendetta/plugin";

makeDefaults(storage, {
	type: "unset",
})

const patches = [];

export default {
	onLoad: () => {
		patches.push(
			chatThing()
		)

	},
	onUnload: () => {
		patches.forEach(un => un());
	},
	settings: settingPage
}
