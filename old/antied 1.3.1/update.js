import { createList } from "../../lib/utility";

function ma(...a) { return [...a] }

// createList(version, new, update, fix)

const update = [
	createList(
		"1.2.0 - 1.2.5",
		ma(
			"[1.2.0] Added Update Section",
			"[1.2.2] Added Support for Semantic Colors",
			"[1.2.2] Added Support for Raw Colors",
			"[1.2.2] Added Support for Timestamp Format",
			"[1.2.5] Added option useEphemeralForDeleted modification in Customize Section",
			"[1.2.5] Added new button on actionMessage if useEphemeralForDeleted disabled"
		),
		ma(
			"[1.2.1] Redesign Setting Page",
			"[1.2.2] Reworked how Message update appends separator",
			"[1.2.4] Update Remove Edit button style"
		),
		ma(
			"[1.2.3] Fixed Remove Edit button to not persist under Edit Message Button",
			"[1.2.4] Fixed Message Parser Fails to parse edited message"
		)
	),
	createList(
		"1.3",
		ma(
			"[1.3] Option to custom name the plugin",
			"[1.3] Option to replace icon toast for edited history toast",
		),
		ma(
			"[1.3] Removes Logging system due crashes and inefficient code",
			"[1.3] Removes patch to user setting to avoid crashes again",
		),
		ma(
			"[1.3] Hopefully fixed the issue with IOS crash on setting",
		)
	),

	// createList(
	// 	"1.",
	// 	ma(
	// 		""
	// 	)
	// ),	
]


export default update.reverse();