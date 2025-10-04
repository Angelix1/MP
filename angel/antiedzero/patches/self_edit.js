import { before } from "@vendetta/patcher";
import { findByProps } from '@vendetta/metro';
import { regexEscaper, isEnabled } from "..";

const Message = findByProps("sendMessage", "startEditMessage")

export default () => before('startEditMessage', Message, (args) => {
	if(!isEnabled) return;

	const DAN = regexEscaper("`[ EDITED ]`\n\n")

	const regexPattern = new RegExp(DAN, 'gmi');

	const [, , msg] = args;
	const lats = msg.split(regexPattern);
	const f = lats[lats.length - 1];

	args[2] = f;
});