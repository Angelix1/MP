import { createList } from "../../lib/utility"

function ma(...a) { return [...a] }

const update = [
	createList(
		"1.0.0",
		ma("Created the Plugin"),
	),
	createList(
		"1.0.1",
		ma(
			"Added Remove Decor",
			"Customization for reply alert",
			"Option to revert locally edited message (wipe on unload of the plugin)",
		),
	),
	createList(
		"1.0.2",
		ma(
			"[1.0.22] Setting for Quick Id",
			"[1.0.22] Option to toggle Force alert",
			"[1.0.22] Preview for ReplyAlert"
		),
		ma(
			"[1.0.2] Remove Custom Timestamp",
		),
		ma(
			"[1.0.21] Fix Cactus",
			"[1.0.22] Fix No Share fails to find Share button",
		)
	),
	// createList(
	// 	"1.0.3",
	// 	ma(
	// 		""
	// 	)
	// ),	
]


export default update.reverse();