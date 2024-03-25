import { getCustomAvatar } from "../lib/lib";

import { findByProps } from "@vendetta/metro"
import { after } from "@vendetta/patcher";
import { isEnabled } from "..";

const avatarStuff = findByProps("getUserAvatarURL", "getUserAvatarSource");

export default () => after("getUserAvatarURL", avatarStuff, ([{ id }]) => {
	if(isEnabled) {
		return getCustomAvatar(id)
	}
}) 