import { React, clipboard, i18n } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { addIcon } from "../../../lib/misc";
import { UIElements } from "../../../lib/utility";
import { after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import { findByProps } from "@vendetta/metro";

const { downloadMediaAsset } = findByProps("downloadMediaAsset")
const { FormRow, FormIcon } = UIElements

export default function noShare(component, args, actionMessage, ActionSheet) {

	if(storage?.toggle?.noshare) {
		if(args == "MediaShareActionSheet") {			
			component.then((instance) => {
				const unpatch = after("default", instance, ([{ syncer }], res) => { // (...argames) => { 
					React.useEffect(() => unpatch(), []);

					let urlsource = syncer.sources[syncer.index.value];
					if(Array.isArray(urlsource)) urlsource = urlsource[0];

					const targetURL = urlsource.sourceURI ?? urlsource.uri;

					const buttonRows = res.props.children.props.children;

					// console.log(buttonRows)

					const position = buttonRows.findIndex((x) => (
						x?.props?.label === i18n?.Messages?.SHARE || x?.props?.label === "Share"
					))
					
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

					const saveButton = (
						<FormRow
							label="Save Image"
							subLabel="Added by Azzy Util"
							leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_download_24px")} />}
							onPress={() => {
								ActionSheet.hideActionSheet()
								downloadMediaAsset(targetURL, 0)
								showToast(`Downloading image`, getAssetIDByName("toast_image_saved"))
							}}
						/>
					)

					const arr = [leButton]

					if(storage.utils.noshare.addSaveImage) {
						arr.push(saveButton)
					}


					if(buttonRows) {				
						if(position >= 0) {
							buttonRows.splice(position, 1) // remove Share Button, Hoepfully
							
							for(const b of arr) {
								buttonRows.splice(position, 0, b)
							}
						}
						else {
							buttonRows.push(...arr)
						}
					}
				})
			})
		}
		/*
		if(args == "MessageLongPressActionSheet") {
			const message = actionMessage?.message;
			if(!message) return;

			component.then((instance) => {
				const unpatch = after("default", instance, ([msg], comp) => {
					React.useEffect(() => () => { unpatch() }, []);

					const buttons = findInReactTree(comp, (x) => x?.[0]?.type?.name === "ButtonRow");
					if (!buttons) return comp;

					const attachments = msg?.message?.attachments;
					const linkies = []

					if(attachments?.length > 0) {
						function createCopyButton(at) {
							return (
								<FormRow
									label={`Copy ${at?.filename} url`}
									subLabel="Added by Azzy Util"
									leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_message_copy")} />}
									onPress={() => {
										ActionSheet.hideActionSheet()
										clipboard.setString(at?.url)
										showToast("Link copied")
									}}
								/>
							)
						}

						for(const att of attachments.reverse()) {
							linkies.push(createCopyButton(att))
						}

					}

					buttons.push(...linkies)
					
				})
			})
		}
		*/
	}
}