import { before, after } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";


import eml_Sheet from "../utils/eml";
import quickCopyID from "../utils/quickId";
import noShare from "../utils/noShare";
import { isEnabled } from "..";

const ActionSheet = findByProps("openLazy", "hideActionSheet");

export default () => before("openLazy", ActionSheet, ([component, args, actionMessage]) => {

	if(isEnabled) {		
		// console.log(component, args, actionMessage)
		quickCopyID(component, args, actionMessage, ActionSheet) // Quick ID
		noShare(component, args, actionMessage, ActionSheet) // No Share
		eml_Sheet(component, args, actionMessage, ActionSheet) // Edit Message Locally
	}
})