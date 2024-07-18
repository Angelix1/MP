import { after, before } from "@vendetta/patcher"
import { findByProps } from "@vendetta/metro";
import { isEnabled } from "..";

const Messages = findByProps("startEditMessage");

export const beforeStartEdit = () => before("startEditMessage", Messages, (args) => {
	if(isEnabled) {
		
	}
})

export const beforeEdit = () => before("editMessage", Messages, (args) => {
	if(isEnabled) {
		
	}
})