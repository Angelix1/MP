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
		null,
		ma(
			"Remove Custom Timestamp"
		),
		ma(
			"[1.0.21] Fix Cactus"
		)
	),	
]


export default update.reverse();