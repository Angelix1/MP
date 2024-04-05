import { findByStoreName } from "@vendetta/metro";

const UserStore = findByStoreName("UserStore");
export const selfId = UserStore?.getCurrentUser?.()?.id


export function replyAlertPatch(event) {
	if(event.type == "MESSAGE_CREATE") {
		// console.log(event)
		if(
			event.message?.referenced_message?.author?.id == selfId ||
			event.message?.mentions?.some(e => e?.id === selfId )
		) {
			event.message.mentions.push({ id: selfId })
		}
	}
}