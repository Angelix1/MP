/* When coding this i got brain damage */

import { makeDefaults } from "../../lib/utility";
import settingPage from "./setting";
import chatThing from "./patches/chat";

import { storage } from "@vendetta/plugin";


makeDefaults(storage, {
	imageURL: "https://cdn.discordapp.com/attachments/919655852724604978/1197224092554772622/9k.png",
	username: "Wario",
	tagText: "WARIO"
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
