import { before, after } from "@vendetta/patcher";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';
import { storage } from "@vendetta/plugin";
import { regexEscaper, isEnabled } from "..";

const Message = findByProps("sendMessage", "startEditMessage")

const logger = (...a) => {
	if(false) {
		console.log(...a)
	}
};

// startEdit is borkne in 293.15 stable

export default () => before('startEditMessage', Message, (args) => {
	if(!isEnabled) return;
	let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";

	const DAN = regexEscaper(Edited)

	const regexPattern = new RegExp(`(?:(?:\\s${DAN}(\\s\\(<t:\\d+:[tTdDfFR]>\\))?\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");

	const [channelId, messageId, msg] = args;
	const lats = msg.split(regexPattern);
	const f = lats[lats.length - 1];

	// Message.startEditMessage(channelId, messageId, f)

	args[2] = f;

	// logger(`[ANTIED > self_edit]\nModified: ${args[2]}\nOrig BELOW\n`, [channelId, messageId, msg], regexPattern)
});