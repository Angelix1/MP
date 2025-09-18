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

				ev.type = "MESSAGE_UPDATE";
				ev.channelId = orig.channel_id || ev.channelId;
				ev.message = {
					...orig,
					content: orig.content,
					type: 0,
					channel_id: orig.channel_id || ev.channelId,
					guild_id: guildId,
					timestamp: new Date().toJSON(),
					state: "SENT",
					was_deleted: true,
					flags: cfg.switches.useEphemeralForDeleted ? 64 : orig.flags
				};
				ev.optimistic = false;
				ev.sendMessageOptions = {};
				ev.isPushNotification = false;

				deletedMessageArray.set(ev.id, { message: args, stage: 1 });

				args[0] = ev;

				return args;
			}

			/* =========================================================
				MESSAGE_UPDATE
			==========================================================*/
			if (ev.type === "MESSAGE_UPDATE") {
				logger("FX; MU", 1)
				if (!cfg.switches?.enableMU || ev.otherPluginBypass) return;
				const msg = ev.message;
				logger("FX; MU", 2)
				if (!msg || msg.author?.bot) return;

				const chId = msg.channel_id || ev.channelId;
				const id = msg.id || ev.id;

				logger(chId, " | ", id)

				const orig = MessageStore.getMessage(chId, id) || ChannelMessages.get(chId)?.get(id);


				logger(orig)

				logger("FX; MU", 3)
				if (!orig?.author?.id || !orig.author.username) return;
				logger("FX; MU", 4)
				if (!orig.content && !orig.attachments?.length && !orig.embeds?.length) return;
				logger("FX; MU", 5)
				if (!msg.content || msg.content === orig.content) return;

				logger("FX; MU", 6)
				if (cfg.inputs?.ignoredUserList?.length) {
					const list = cfg.inputs.ignoredUserList;
					if (list.some(u => u.id === orig.author.id || u.username === orig.author.username)) return;
				}

				const editedTag = cfg.inputs?.editedMessageBuffer || "`[ EDITED ]`";

				const time = cfg.switches?.addTimestampForEdits
					? `(<t:${Math.floor(now() / 1000)}:${tsStyle()}>)`
					: null;

				const tsPos = cfg.misc?.timestampPos === "BEFORE";

				let prefix = `${editedTag}`;

				prefix = time ? 
					tsPos ? 
						`${time} ${prefix}\n\n` : `${prefix} ${time}\n\n` : 
					`${prefix}\n\n`;

				logger("FX; MU", 7)


				logger(orig.content.includes(editedTag), orig.content.includes(editedTag)?.length ?? "N/A")

				logger(orig, "\n". msg)


				ev.message = {
					...msg,
					content: `${orig.content} ${prefix}${msg.content}`,
					guild_id: ChannelStore.getChannel(chId)?.guild_id ?? msg.guild_id,
					edited_timestamp: "invalid_timestamp"
				};

				args[0] = ev;

				return args;
			}
			
		} catch (e) {
			showToast("[ANTIED] FluxDispatcher crash – check logs");
			console.error("[ANTIED] Flux patch\n", e);
		}
	}
});