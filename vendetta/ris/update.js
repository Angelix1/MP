import { createList } from "../../lib/utility"

function ma(...a) { return [...a] }

const update = [
	createList(
		"1.0.0",
		ma("Created the Plugin"),
	),
	createList(
		"1.0.1",
		ma("Added FuzzySearch"),
	),
	createList(
		"1.0.2",
		ma("Added Option to remove telemetry"),
	),
	createList(
		"1.0.3",
		ma(
			"Added Option to toggle encoding for parsed URL",
			"Url Parser will automatically encode URL before sending to RIS APIs"
		)
	)
]


export default update.reverse();