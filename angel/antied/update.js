import { createList } from "../../lib/utility";

function ma(...a) { return [...a] }

// createList(version, new, update, fix)

const update = [
	createList(
		"1.0 - 1.3",
		null,
		ma("Version 1.4 does not support backwards compatibility after Discord version 265.16 Stable.")
	),
	createList(
		"1.4.0",
		ma(
			"[1.4] Trying to reinstate colorful setting for IOS.",
			"[1.4] Added new Option to Remove Ephemeral Indicator",
			"[1.4] Added new Option to Switch 'this message is deleted' to be an indicator",
			"[1.4] Added debug updateRows Switch for nerds.",
			"[1.4] Added Known Bugs Section for those annoying peoples complaining about things."
		),
		ma(
			"[1.4] Discontinued Support for older version related to updateRows function, Use Version 1.3.1 if you using old version",
		),
		ma(
			"[1.4] Update updateRows function to Support Newer Version of Discord",
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