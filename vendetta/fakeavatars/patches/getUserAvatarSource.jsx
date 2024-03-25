import { findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { isEnabled } from "..";
import { getCustomAvatar } from "../lib/lib";


const avatarStuff = findByProps("getUserAvatarURL", "getUserAvatarSource");

export default () => after("getUserAvatarSource", avatarStuff, ([{ id }, animate], ret) => {

	if(isEnabled) {
		const custom = getCustomAvatar(id, !animate);
		if (!custom) return;
		return custom ? { uri: custom } : ret;
	}

})
