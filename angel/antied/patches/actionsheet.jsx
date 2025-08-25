import { before, after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import { React, ReactNative, FluxDispatcher, i18n } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";
import { storage } from "@vendetta/plugin";
import { findByProps } from '@vendetta/metro';
import { colorConverter, setOpacity } from "../../../lib/utility";
import { regexEscaper, stripVersions } from "..";
import { plugin } from "@vendetta";

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const MessageStore = findByProps("getMessage", "getMessages");
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const ChannelMessages = findByProps("_channelMessages");
const { ActionSheetRow } = findByProps("ActionSheetRow");

export default (deletedMessageArray) => before("openLazy", ActionSheet, ([component, args, actionMessage]) => {
	const message = actionMessage?.message;

	if (args !== "MessageLongPressActionSheet" || !message) return;

	component.then((instance) => {
		const unpatch = after("default", instance, (_, comp) => {
			React.useEffect(() => () => { unpatch() }, []);

			// if(storage.debug) console.log(deletedMessageArray);
			if(storage.debug) console.log(`[ANTIED ActionSheet]`, message)


			// added in 1.4.1, for simple pointer func used to filter out target button group, and where the func i18n goes?
			function someFunc(a) {
				// return a?.props?.label == i18n?.Messages?.MESSAGE_ACTION_REPLY
				return a?.props?.label?.toLowerCase?.() == 'reply'
			}

			const buttons = findInReactTree(comp, c => c?.find?.(someFunc))
			if (!buttons) return comp;
			
			const position = Math.max(
				buttons.findIndex(someFunc), 
				buttons.length - 1
			);
			
			let originalMessage = null;

			if (message?.channel_id && message?.id) {
			    originalMessage = MessageStore.getMessage(message?.channel_id, message?.id);

				if(!originalMessage) {
					const channel = ChannelMessages.get(message?.channel_id);
					originalMessage = channel?.get(message?.id);
				}
			}

			if(!originalMessage) return comp;

			const escapedBuffer = regexEscaper(storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`")

			const separator = new RegExp(escapedBuffer, 'gmi');
			const checkIfBufferExist = separator.test(message.content);

			// const absurdRegex = /(?:(?:\s`[^\`]+`\s\(<t:\d+:[tTdDfFR]>\)\n{2})|(?:(?:\s\(<t:\d+:[tTdDfFR]>\) `[^\`]+`\n{2})))/gmi;

			if(checkIfBufferExist) {
				const targetPos = position || 1;
				
				buttons.splice(targetPos, 0, (
					<ActionSheetRow
						label="Remove Edit History"
						subLabel={`Added by ${stripVersions(plugin?.manifest?.name) || "ANTIED"}`}
						icon={<ActionSheetRow.Icon source={getAssetIDByName("ic_edit_24px")}/>}
						onPress={() => {
							let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";

							const DAN = regexEscaper(Edited)

							const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");
							const lats = message?.content?.split(regexPattern);

							if(storage.debug) {
								console.log([
									[Edited],
									message?.content?.split(regexPattern),
									lats
								])
							}
							const targetMessage = lats[lats.length - 1];

							// console.log(message.embeds)

							const messageEmbeds = message?.embeds?.map(embedData => {                                            
								const rawHSLA = embedData?.color?.replace(/.+\(/, "")?.replace(/%/g, "")?.replace(")", "")

								const split = rawHSLA?.split(', ')

								const embedColor = ReactNative.processColor(`${
									setOpacity(
										colorConverter.HSLtoHEX(
											split[0], split[1], split[2]
										), 
										split[3]
									)
								}`)

								return {
									...embedData,
									author: embedData.author,
									title: embedData.rawTitle,
									description: embedData.rawDescription,
									url: embedData.url,
									type: embedData.type,
									image: embedData.image,
									thumbnail: embedData.thumbnail,
									color: embedColor,
									content_scan_version: 1
								}
							})

							// console.log(messageEmbeds)

							FluxDispatcher.dispatch({
								type: "MESSAGE_UPDATE",
								message: {
									...message,
									content: `${targetMessage}`,
									embeds: messageEmbeds ?? [],
									attachments: message.attachments ?? [],
									mentions: message.mentions ?? [],
									guild_id: ChannelStore.getChannel(originalMessage.channel_id).guild_id,
								},
								otherPluginBypass: true
							})

							ActionSheet.hideActionSheet()
							if(storage?.inputs?.historyToast?.length > 0 || storage?.inputs?.historyToast != "") {
								showToast(storage?.inputs?.historyToast?.toString?.(), getAssetIDByName(storage?.misc?.editHistoryIcon || "ic_edit_24px"))
							}
						}
					}/>
				))
			}

			if(storage.debug) console.log(
				`[ANTIED ActionSheet]`, 
				"useEphemeralForDeleted", !storage?.switches?.useEphemeralForDeleted, 
				"msgExist?", Boolean(deletedMessageArray[message.id])
			);

			if(!storage?.switches?.useEphemeralForDeleted && deletedMessageArray[message.id]) {
				const targetPos = position || 1;
				
				buttons.splice(targetPos, 0, (
					<ActionSheetRow
						label="Remove Deleted Message"
						subLabel={`Added by ${stripVersions(plugin?.manifest?.name) || "ANTIED"}`}
						isDestructive={true}
						icon={<ActionSheetRow.Icon source={getAssetIDByName("ic_edit_24px")}/>}
						onPress={() => {
							FluxDispatcher.dispatch({ 
								type: 'MESSAGE_DELETE',
								guildId: ChannelStore.getChannel(originalMessage.channel_id).guild_id,
								id: message?.id,
								channelId: message?.channel_id,
								otherPluginBypass: true
							})

							ActionSheet.hideActionSheet()
							if(storage?.inputs?.historyToast?.length > 0 || storage?.inputs?.historyToast != "") {
								showToast(`[ANTIED] Message Removed`, getAssetIDByName("ic_edit_24px"))
							}
						}
					}/>
				))
			}			
		})
	})
})
