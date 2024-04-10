
function transformObject(obj, inputColor) {
	const charColor = inputColor?.toString();
	const compTypes = [
		"text",
		"heading",
		"s",
		"u",
		"em",
		"strong",
		"list",
		"blockQuote"
		];

	if (Array.isArray(obj)) {
		return obj.map(data => transformObject(data, charColor));
	} 
	else if (typeof obj === "object" && obj !== null) {
		const { content, type, target, items } = obj;

		if(!compTypes.includes(type)) return obj;

		if (type === "text" && content && content.length >= 1) {

			return {
				content: [{
					content: content,
					type: "text"
				}],
				target: "usernameOnClick",
				type: "link",
				context: {
					username: 1,
					medium: true,
					usernameOnClick: {
						action: "0",
						userId: "0",
						linkColor: ReactNative.processColor(charColor),
						messageChannelId: "0"
					}
				}
			};
		}

		const updatedContent = transformObject(content, charColor);
		const updatedItems = items ? items.map(transformObject, charColor) : undefined;

		if (updatedContent !== content || updatedItems !== items || !compTypes.includes(type)) {
			const updatedObj = { ...obj, content: updatedContent };

			if (type === "blockQuote" && target) {
				updatedObj.content = updatedContent;
				updatedObj.target = target;
			}

			if (type === "list") {
				if (updatedObj?.content) {
					delete updatedObj.content;
				}
			}

			if (items) {
				updatedObj.items = updatedItems;
			}

			return updatedObj;
		}
	}

	return obj;
}

export function updateRowTextMod(row) {
	if(row.message.content) {
	
	}
}