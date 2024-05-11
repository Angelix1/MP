import { before } from "@vendetta/patcher";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';
import { storage } from "@vendetta/plugin";
import { regexEscaper } from "..";

const Message = findByProps("startEditMessage")

export default () => before('startEditMessage', Message, (args) => {

	let Edited = storage?.inputs?.editedMessageBuffer || "`[ EDITED ]`";

	const DAN = regexEscaper(Edited)

	const regexPattern = new RegExp(`(?:(?:\\s${DAN}\\s\\(<t:\\d+:[tTdDfFR]>\\)\\n{2})|(?:(?:\\s\\(<t:\\d+:[tTdDfFR]>\\) ${DAN}\\n{2})))`, "gm");

	const [channelId, messageId, msg] = args;
	const lats = msg.split(regexPattern);
	args[2] = lats[lats.length - 1];
	return args;
});