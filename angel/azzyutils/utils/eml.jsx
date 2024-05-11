import { FluxDispatcher, React, i18n } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { findInReactTree } from "@vendetta/utils";
import { findByProps } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { after } from "@vendetta/patcher";

const MessageStore = findByProps("getMessage", "getMessages");
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const Messages = findByProps("startEditMessage");
const { ActionSheetRow } = findByProps("ActionSheetRow");

let AZZYEML = false;

export default function eml_Sheet(component, args, actionMessage, ActionSheet) {

	if(args == "MessageLongPressActionSheet" && storage?.toggle?.eml) {
		const message = actionMessage?.message;
		if(!message) return;

		component.then((instance) => {
			const unpatch = after("default", instance, (_, comp) => {
				React.useEffect(() => () => { unpatch() }, []);

				const buttons = findInReactTree(comp, c => c?.find?.(child => child?.props?.label == i18n?.Messages?.MESSAGE_ACTION_REPLY))
				if (!buttons) return comp;
				
				const position = Math.max(
					buttons.findIndex((x) => x?.props?.label == i18n?.Messages?.MESSAGE_ACTION_REPLY), 
					buttons.length - 1
				);

				const savedMsg = storage?.utils?.eml?.editedMsg?.find(m => m.id == message?.id);

				if(savedMsg) {
					buttons.splice(position, 0, (<>
						<ActionSheetRow
							label="Revert Locally Edited Message"
							subLabel="Added by Azzy Util"
							icon={<ActionSheetRow.Icon source={getAssetIDByName("ic_edit_24px")}/>}
							onPress={() => {
								const origin = MessageStore.getMessage(message.channel_id, message.id);
								FluxDispatcher.dispatch({
									type: "MESSAGE_UPDATE",
									message: {
										...origin,
										...message,
										content: savedMsg.content,
										edited_timestamp: origin.editedTimestamp, 
										mention_roles: origin.mentionRoles, 
										mention_everyone: origin.mentionEveryone, 
										guild_id: ChannelStore.getChannel(
											origin.channel_id || message.channel_id
										)?.guild_id
									},
									otherPluginBypass: true
								})

								storage.utils.eml.editedMsg = storage?.utils?.eml?.editedMsg?.filter(x => x.id != message.id);
								ActionSheet.hideActionSheet()
							}}
						/>
					</>))
				} 
				else {					
					buttons.splice(position, 0, (<>
						<ActionSheetRow
							label="Edit Message Locally"
							subLabel="Added by Azzy Util"
							icon={<ActionSheetRow.Icon source={getAssetIDByName("ic_edit_24px")}/>}
							onPress={() => {
								Messages.startEditMessage(`AZZYEML-${message.channel_id}`, message.id, message.content);
								ActionSheet.hideActionSheet()
							}}
						/>
					</>))
				}

			})
		})
	}
}

export function eml_startEditMessage(args) {
	if(args[0]?.startsWith("AZZYEML-")) {
		args[0] = args[0].replaceAll("AZZYEML-", "");
		AZZYEML = true
		return args
	}
	else {
		AZZYEML = false
		return args
	}
}

export function eml_editMessage(args) {
	if(AZZYEML) {
		let [channelId, messageId, msg] = args;

		const origin = MessageStore.getMessage(channelId, messageId);

		storage?.utils?.eml?.editedMsg.push(origin)
		
		FluxDispatcher.dispatch({
			type: "MESSAGE_UPDATE",
			message: {
				...origin,
				...msg,
				edited_timestamp: origin.editedTimestamp, 
				mention_roles: origin.mentionRoles, 
				mention_everyone: origin.mentionEveryone, 
				member: origin.author, 
				guild_id: ChannelStore.getChannel(origin.channel_id || channelId)?.guild_id				
			},
			otherPluginBypass: storage?.utils?.eml?.logEdit
		})
		showToast("Message Edited", getAssetIDByName("ic_edit_24px"))
	}
}