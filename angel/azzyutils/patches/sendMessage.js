import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

import { isEnabled } from "..";
import { Cactus } from "../utils/cactus";

const Messages = findByProps("sendMessage", "receiveMessage");


export default () => before("sendMessage", Messages, (args) => {
	if(isEnabled) {
		Cactus(args[1]) // uh things 
	}
});