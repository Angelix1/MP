import { findByStoreName } from "@vendetta/metro";
import { urlExt } from "../lib/lib";
import { isEnabled } from "..";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

const UserStore = findByStoreName("UserStore");

export default () => after("getUser", UserStore, ([id], ret) => {
	if(isEnabled) {
		const doesExist = storage?.users[id]?.avatar;
		if(doesExist) {
			if(urlExt(doesExist) == "gif") {
				ret.avatar = !doesExist.startsWith("a_") ? `a_${doesExist?.avatar}` : doesExist?.avatar;
			} 
			else {
				ret.avatar = doesExist?.avatar;
			}
		}
	}
})
