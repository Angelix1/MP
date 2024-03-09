
function createList(version, a, u, f) {
	return {
		version,
		new: a,
		updated: u,
		fix: f
	}
}

function ma(...a) { return [...a] }



const update = [
	createList(
		"1.0.0",
		ma("Created the Plugin"),
		null,
		null,
	),
	createList(
		"1.0.1",
		ma("Updates Sections"),
		null,
		ma("Excludes links, emoji, timestamp, and mentions")
	)
]



export default update.reverse();