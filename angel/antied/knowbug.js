const knownBugs = [
	{
		bugType: "SELF_EDIT_MESSAGE",
		bugDescription: "When starting to edit a message, old history gets included. Use BetterBetterChatGestrure Plugin to force edit message using function Antied Watch."
	},
	{
		bugType: "MESSAGE_DELETION_BOT_DISMISS",
		bugDescription: "in Rare Occasion, Delete Patcher can fail to dismiss ephemeral messages, often happens in bot messages."
	},
]


export default knownBugs;