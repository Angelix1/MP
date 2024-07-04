import { createList } from "../../lib/utility";

function ma(...a) { return [...a] }

// createList(version, new, update, fix)

const update = [
	createList(
		"1.2.0",
		ma("Added Update Section"),
	),
	createList(
		"1.2.1",
		null,
		ma("Redesign Setting Page")
	),
	createList(
		"1.2.2",
		ma(
			"Added Support for Semantic Colors",
			"Added Support for Raw Colors",
			"Added Support for Timestamp Format",
		),
		ma("Reworked how Message update appends separator")
	),
	createList(
		"1.2.3",
		null,
		null,
		ma("Fixed Remove Edit button to not persist under Edit Message Button")
	),
	createList(
		"1.2.4",
		null,
		ma("Update Remove Edit button style"),
		ma("Fixed Message Parser Fails to parse edited message")
	),
	createList(
		"1.2.5",
		ma(
			"Added option useEphemeralForDeleted modification in Customize Section",
			"Added new button on actionMessage if useEphemeralForDeleted disabled"
		),
	),

	// createList(
	// 	"1.",
	// 	ma(
	// 		""
	// 	)
	// ),	
]


export default update.reverse();