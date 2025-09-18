import { createList } from "../../lib/utility";

function ma(...a) { return [...a] }

// createList(version, new, update, fix)

const update = [
	createList(
		"1.4.0",
		ma(
			"[1.4] Trying to reinstate colorful setting for IOS.",
			"[1.4] Added new Option to Remove Ephemeral Indicator",
			"[1.4] Added new Option to Switch 'this message is deleted' to be an indicator",
			"[1.4] Added Known Bugs Section for those annoying peoples complaining about things.",
			"[1.4.3] Added use Custom Plugin name option and alternative way to set Alpha.",
		),
		ma(
			"[1.4] Discontinued Support for older version related to updateRows function, Use Version 1.3.1 if you using old version",
			"[1.4.3] Refactor Flux and Row to be more efficent and added cache limit.",
			"[1.4.3] Fixed editing message issue where it includes old content."
		),
		ma(
			"[1.4] Update updateRowsPatch to Support Newer Version of Discord",
			"[1.4.1] Fixed ActionSheet button being weird, updated in 293.xx Stable release",
			"[1.4.2] Fortified updateRowsPatch with additonal safeguards, possibly fixed crashes on Alpha/Beta builds."
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