import { React, clipboard, i18n } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { addIcon } from "../../../lib/misc";
import { UIElements } from "../../../lib/utility";
import { after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormRow, FormIcon } = UIElements

export default function noShare(component, args, actionMessage, ActionSheet) {

	if(args == "MediaShareActionSheet" && storage?.toggle?.noshare) {
		
		component.then((instance) => {
			const unpatch = after("default", instance, ([{ syncer }], res) => { // (...argames) => { 
				React.useEffect(() => unpatch(), []);

				let urlsource = syncer.sources[syncer.index.value];
				if(Array.isArray(urlsource)) urlsource = urlsource[0];

				const targetURL = urlsource.sourceURI ?? urlsource.uri;

				const buttonRows = res.props.children.props.children;

				console.log(buttonRows)
				console.log("=".repeat(40))
				
				const position = Math.max(
					buttonRows.findIndex((x) => x?.props?.message === i18n?.Messages?.SHARE),
					0
				)
				console.log(buttonRows)

				const leButton = (
					<FormRow
						label="Copy Image Link"
						subLabel="Added by Azzy Util"
						leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_message_copy")} />}
						onPress={() => {
							ActionSheet.hideActionSheet()
							clipboard.setString(targetURL)
							showToast("Link copied")
						}}
					/>
				)

				if(buttonRows) {				
					if(position >= 0) {
						buttonRows.splice(position, 1, leButton)
					} 
					else {
						buttonRows.push(leButton)
					}
				}
			})
		})
	}
}
