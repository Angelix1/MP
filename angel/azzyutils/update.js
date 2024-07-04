import { createList } from "../../lib/utility"

function ma(...a) { return [...a] }

const update = [
	createList(
		"1.0.0",
		ma("Created the Plugin"),
	),
	createList(
		"1.0.1 - 1.0.3",
		ma(
			"[1.0.1] Added Remove Decor",
			"[1.0.1] Customization for reply alert",
			"[1.0.1] Option to revert locally edited message (wipe on unload of the plugin)",			
			"[1.0.22] Setting for Quick Id",
			"[1.0.22] Option to toggle Force alert",
			"[1.0.22] Preview for ReplyAlert"
		),
		ma(
			"[1.0.2] Remove Custom Timestamp",
			"[1.0.24] EML will wipe its log when onunload and revert every message its edit",
			"[1.0.3] Update EML, QID buttons"
		),
		ma(
			"[1.0.21] Fix Cactus",
			"[1.0.22] Fix No Share fails to find Share button",
			"[1.0.23] Fix Quick ID removing edit message button",
			"[1.0.3] Fixed EML button fails to append under Reply Button",
			"[1.0.3] Fixed QID buttons fails to append to a correct place",
		)
	),
	createList(
		"1.1.0",
		ma(
			"[1.1.0] Added Custom Username Color",
			"[1.1.0] Added Custom Role Icon",
		),
		ma(
			"[1.1.0] Separated reply alert and custom mention to be their own thing",
		)
	)
]


export default update.reverse();