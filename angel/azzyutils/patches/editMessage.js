import { after, before } from "@vendetta/patcher"
import { eml_editMessage, eml_startEditMessage } from "../utils/eml"
import { findByProps } from "@vendetta/metro";
import { isEnabled } from "..";

const Messages = findByProps("startEditMessage");

export const beforeStartEdit = () => before("startEditMessage", Messages, (args) => {
	if(isEnabled) {
		eml_startEditMessage(args) // EML
	}
})

export const beforeEdit = () => before("editMessage", Messages, (args) => {
	if(isEnabled) {
		eml_editMessage(args) // EML
	}
})