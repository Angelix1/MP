import { before } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { FluxDispatcher } from "@vendetta/metro/common";

import { isEnabled } from "..";

const ChannelStore = findByProps("getChannel", "getDMFromUserId");
const ChannelMessages = findByProps("_channelMessages");
const MessageStore = findByProps('getMessage', 'getMessages');


/* ----------  Helpers  ---------- */
const now = () => Date.now();
const tsStyle = () => {
	const s = storage.switches?.timestampStyle;
	return (s && "tTdDfFR".includes(s)) ? s : "R";
};

const logger = (...a) => {
	if(false) {
		console.log(...a)
	}
};

export default deletedMessageArray => before("dispatch", FluxDispatcher, args => {
	if(isEnabled) {
		try {
			const ev = args[0];
			if (!ev || !ev.type) return; // literally get fucked if you doesnt have type

			const cfg = storage;
			if (cfg.debug) console.log("[ANTIED flux]", ev);

			/* =========================================================
				MESSAGE_DELETE
			==========================================================*/
			if (ev.type === "MESSAGE_DELETE") {
				if (!cfg.switches?.enableMD || ev.otherPluginBypass) return;

				const orig = ChannelMessages.get(ev.channelId)?.get(ev.id);
				if (!orig?.author?.id || !orig.author.username) return;

				// ephemeral message dismiss (from bots)
				if(orig?.author?.bot && orig?.type == 64) return;

				// empty message check
				if (!orig.content && !orig.attachments?.length && !orig.embeds?.length) return;

				if (cfg.switches.ignoreBots && orig.author.bot) return;

				if (cfg.inputs?.ignoredUserList?.length) {
					const list = cfg.inputs.ignoredUserList;
					if (list.some(u => u.id === orig.author.id || u.username === orig.author.username)) return;
				}

				const entry = deletedMessageArray.get(ev.id);
				if (entry?.stage === 2) return; // Kill message normally
				if (entry?.stage === 1) { // first pass
					entry.stage = 2;
					return entry.message || args;
				}

				const guildId = ChannelStore.getChannel(orig.channel_id || ev.channelId)?.guild_id;

				/*  reuse the same object shape every time  */

				const newMessageObject = {
					...orig,
					content: orig.content,
					channel_id: orig.channel_id || ev.channelId,
					guild_id: guildId,
					was_deleted: true,
					message_reference: orig?.message_reference || orig?.messageReference || null,
					// type: 0,
					// timestamp: new Date().toJSON(),
					// state: "SENT",
				}

				if(cfg.switches.useEphemeralForDeleted) newMessageObject.flags = 64;

				args[0] = {
					type: "MESSAGE_UPDATE",
					channelId: orig.channel_id || ev.channelId,
					message: newMessageObject,
					optimistic: false,
					sendMessageOptions: {},
					isPushNotification: false
				}

				deletedMessageArray.set(ev.id, { message: args, stage: 1 });

				return args;
			}

			/* =========================================================
				MESSAGE_UPDATE
			==========================================================*/
			if (ev.type === "MESSAGE_UPDATE") {
				if (!cfg.switches?.enableMU || ev.otherPluginBypass) return;
				const msg = ev.message;

				if (!msg || msg.author?.bot) return;

				const chId = msg.channel_id || ev.channelId;
				const id = msg.id || ev.id;

				const orig = MessageStore.getMessage(chId, id) || ChannelMessages.get(chId)?.get(id);

				if (!orig?.author?.id || !orig.author.username) return;
				
				if (!orig.content && !orig.attachments?.length && !orig.embeds?.length) return;
				
				if (!msg.content || msg.content === orig.content) return;

				if (cfg.inputs?.ignoredUserList?.length) {
					const list = cfg.inputs.ignoredUserList;
					if (list.some(u => u.id === orig.author.id || u.username === orig.author.username)) return;
				}

				const editedTag = cfg.inputs?.editedMessageBuffer || "`[ EDITED ]`";

				const time = cfg.switches?.addTimestampForEdits
					? `(<t:${Math.floor(now() / 1000)}:${tsStyle()}>)`
					: null;

				const tsPos = cfg.misc?.timestampPos === "BEFORE";
				const newMessage = msg || orig;

				let prefix = `${editedTag}`;

				prefix = time ? 
					tsPos ? 
						`${time} ${prefix}\n\n` : `${prefix} ${time}\n\n` : 
					`${prefix}\n\n`;


				args[0] = {
					type: "MESSAGE_UPDATE",  
					message: {
						...newMessage,
						content: `${orig.content} ${prefix}${msg.content}`,
						guild_id: ChannelStore.getChannel(chId)?.guild_id ?? msg.guild_id,
						edited_timestamp: "invalid_timestamp",
						message_reference: msg?.message_reference || orig?.messageReference || null,
					}
				};

				return args;
			}
			
		} catch (e) {
			showToast("[ANTIED] FluxDispatcher crash – check logs");
			console.error("[ANTIED] Flux patch\n", e);
		}
	}
});

/*
type: 19

messageReference:
   { type: 0,
     message_id: '1418310241086472312',
     guild_id: '1088889567354028083',
     channel_id: '1100378389744992317' },

     */