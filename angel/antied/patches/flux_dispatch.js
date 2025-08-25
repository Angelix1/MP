import { instead, before, after } from "@vendetta/patcher"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { findInReactTree } from "@vendetta/utils"
import { findByProps, findByStoreName } from "@vendetta/metro"
import { React, FluxDispatcher } from "@vendetta/metro/common"
import { Forms } from "@vendetta/ui/components"
import { storage } from "@vendetta/plugin";

const ActionSheet = findByProps("openLazy", "hideActionSheet")
const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const ChannelMessages = findByProps("_channelMessages");
const MessageStore = findByProps('getMessage', 'getMessages');

/* THIS Function Janky
const altMessageStore = findByStoreName("MessageStore")
const logs = altMessageStore._dispatcher.actionLogger.logs;

function messageGetter(authorId) {
    const allOcc = logs.filter(x => 
        x?.action?.type === "MESSAGE_UPDATE" && 
        x?.action?.message?.author?.id === authorId
    );
    
    // Use .at(-1) for cleaner syntax, with a fallback to the old way
    const lastEntry = allOcc.at(-1);
    return lastEntry?.action?.message ?? null;
}

*/

/*
i kinda hated discord constant nugging the flux


- Angelw0lf
*/

export default (deletedMessageArray) => before("dispatch", FluxDispatcher, (args) => {
	const [event] = args;
	const type = event?.type;

	if(storage.debug) console.log(`[ANTIED fluxdispatcher]`, event)
	// Message Delete Patch
	if( type == "MESSAGE_DELETE" ) {
		if(storage.switches.enableMD == false) return args;

		if(event?.otherPluginBypass) return args;

		const channel = ChannelMessages.get(event.channelId);
		const originalMessage = channel?.get(event.id);		
		if (!originalMessage) return args;

		if(event?.id && deletedMessageArray[event?.id]?.stage == 2) 
			return args;

		if(event?.id && deletedMessageArray[event?.id]?.stage == 1) {
			deletedMessageArray[event?.id].stage = 2;
			return deletedMessageArray[event?.id]?.message ?? args;
		}
	
		const OMCheck1 = originalMessage?.author?.id;
		const OMCheck2 = originalMessage?.author?.username;
		const OMCheck3 = (!originalMessage?.content && originalMessage?.attachments?.length == 0 && originalMessage?.embeds?.length == 0);
		
		if (!OMCheck1 || !OMCheck2 || OMCheck3) 
			return args;

		if(storage?.switches?.ignoreBots && originalMessage?.author?.bot) 
			return args;

		if(
			(storage?.inputs?.ignoredUserList?.length > 0) &&
			storage.inputs.ignoredUserList?.some(user => 
				(user?.id == originalMessage?.author?.id) || (user.username == originalMessage.author.username) 
			)
		) return args;


		const messageGuildId = ChannelStore?.getChannel(originalMessage?.channel_id)?.guild_id;

		let messageObjectByAntied = { 
			...originalMessage,
			content: originalMessage?.content,
			type: 0,			
			channel_id: originalMessage?.channel_id || event?.channelId,
			guild_id: messageGuildId,
			timestamp: `${new Date().toJSON()}`,
			state: "SENT",
			was_deleted: true
		};

		if(storage?.switches?.useEphemeralForDeleted) messageObjectByAntied.flags = 64;

		args[0] = {
			type: "MESSAGE_UPDATE",
			channelId: originalMessage?.channel_id || event?.channelId,
			message: messageObjectByAntied, 
			optimistic: false, 
			sendMessageOptions: {}, 
			isPushNotification: false,
		}

		deletedMessageArray[event?.id || originalMessage?.id] = {
			message: args,
			stage: 1
		}

		return args;
	}

	// Message Update Patch
	if( type == "MESSAGE_UPDATE" ) {
		// console.log(event)
		if(storage.switches.enableMU == false) return args;
		
		if(event?.otherPluginBypass) return args;

		if(event?.message?.author?.bot) return args;

		const channelId = event?.message?.channel_id ?? event?.channelId;
		const messageId = event?.message?.id ?? event?.id;

		let originalMessage = null;

		// first use existing getter;
		if (channelId && messageId) {
		    originalMessage = MessageStore.getMessage(channelId, messageId);
		    
			if(!originalMessage) {			
				const channel = ChannelMessages.get(channelId);
				originalMessage = channel?.get(messageId);	
			}
		}

		// console.log(event?.message?.content)
		// console.log(originalMessage?.content)

		// if still doesnt exist then just bypass
        if(!originalMessage) return	args;
         
		if (!originalMessage.author?.id || !originalMessage.author?.username) return args;
		if (!originalMessage.content && originalMessage.attachments?.length === 0 && originalMessage.embeds?.length === 0) return args;
		
		if(!event?.message?.content) return args;
		
		if(event?.message?.content == originalMessage?.content) return args;

		if(
			(storage?.inputs?.ignoredUserList?.length > 0) &&
			storage?.inputs?.ignoredUserList?.some(user => 
				(user?.id == originalMessage?.author?.id) || (user?.username == originalMessage?.author?.username) 
			)
		) return args;

		let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";

		const addNewLine = str => `${str}\n\n`;

		const newMsg = event?.message || originalMessage;
		let newMessageContent = `${originalMessage?.content}`

		if(storage?.switches?.addTimestampForEdits) {
			const now = Date.now()

			const validPrefix = ["t", "T", "d", "D", "f", "F", "R"];

			const timeStyle = validPrefix.some(x => x == storage.switches.timestampStyle) ? storage.switches.timestampStyle : "R";

			const timeRelative = `<t:${Math.abs(Math.round(now / 1000))}:${timeStyle}>`

			if(storage?.misc?.timestampPos == "BEFORE") {
				const tem = `${addNewLine(`(${timeRelative}) ${Edited}`)}${event?.message?.content ?? ""}`;
				newMessageContent += `  ${tem}`;
			}
			else {
				const tem = `${addNewLine(`${Edited} (${timeRelative})`)}${event?.message?.content ?? ""}`;
				newMessageContent += `  ${tem}`;
			}
		} 
		else {
			newMessageContent += `  ${addNewLine(Edited)}${event?.message?.content ?? ""}`;
		}

		const messageGuildId = ChannelStore.getChannel(event?.channelId || event?.message?.channel_id || originalMessage?.channel_id)?.guild_id

		args[0] = {
			type: "MESSAGE_UPDATE",  
			message: {
				...newMsg,
				content: newMessageContent,
				guild_id: messageGuildId,
				edited_timestamp: "invalid_timestamp",
			},
		};

		return args;
	}
	return args;
})

