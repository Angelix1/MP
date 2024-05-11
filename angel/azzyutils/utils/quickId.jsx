import { React, clipboard, i18n } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { findInReactTree } from "@vendetta/utils";
import { after } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";

const { ActionSheetRow } = findByProps("ActionSheetRow");

export default function quickCopyID(component, args, actionMessage, ActionSheet) {

	if(args == "MessageLongPressActionSheet" && storage?.toggle?.quickid) {
		const message = actionMessage?.message;
		if(!message) return;

		component.then((instance) => {
			const unpatch = after("default", instance, (_, comp) => {
				React.useEffect(() => () => { unpatch() }, []);

				const buttons = findInReactTree(comp, c => c?.find?.(child => child?.props?.label == i18n?.Messages?.MENTION))
				if (!buttons) return comp;
				
				const position = Math.max(
					buttons.findIndex((x) => x?.props?.label == i18n?.Messages?.MENTION), 
					buttons.length - 1
				);

				if(storage.debug) {
					console.log(buttons)
					console.log("Position => " + position)
				}

				function createButton(label, sub, icon, callback) {
					return { label, sub, icon, callback }
				}

				let customButtons = []

				const { addID, addMention, addCombine } = storage?.utils?.quickid;

				if(addID) {
					customButtons.push(
						createButton(
							"Copy User's Id",
							"Result: <Some ID>",
							"ic_copy_id",
							function () {
								ActionSheet.hideActionSheet()
								clipboard.setString(message?.author?.id ?? '')
								showToast("Copied User's ID to clipboard", getAssetIDByName("toast_copy_link"))
							}
						)
					)
				}
				if(addMention) {
					customButtons.push(
						createButton(
							"Copy User's Mention",
							"Result: <Mention>",
							"ic_copy_id",
							function () {
								ActionSheet.hideActionSheet()
								clipboard.setString(`<@${message?.author?.id ?? ''}>`)
								showToast("Copied User's Mention to clipboard", getAssetIDByName("toast_copy_link"))
							}
						)
					)
				}
				if(addCombine) {
					customButtons.push(
						createButton(
							"Copy User's Id and Mention",
							"Result: <Some ID> <Mention>",
							"ic_copy_id",
							function () {
								ActionSheet.hideActionSheet()
								clipboard.setString(`${message?.author?.id ?? ''} <@${message?.author?.id ?? ''}>`)
								showToast("Copied User to clipboard", getAssetIDByName("toast_copy_link"))
							}
						)
					)
				}

				customButtons.reverse();
				
				if(position >= 0) {
					buttons.splice(position, 1) // remove Mention Button
				}

				for(const btn of customButtons) {
					const newButton = (<>
						<ActionSheetRow
							label={btn?.label}
							subLabel={btn?.sub}
							icon={btn?.icon && <ActionSheetRow.Icon source={getAssetIDByName(btn?.icon)}/>}
							onPress={btn?.callback}
						/>
					</>)

					if(position >= 0) {
						buttons.splice(position, 0, newButton)
					} 
					else {
						buttons.push(newButton)
					}
				}
			})
		})
	}
}