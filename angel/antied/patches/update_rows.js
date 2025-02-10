import { ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { findByProps } from '@vendetta/metro';

// const { DCDChatManager } = ReactNative.NativeModules;
const rowsController = findByProps("updateRows", "getConstants")


/*

Time wasted: 2 hours 41 minutes
*/

// export default (deletedMessagesArray) => before("updateRows", DCDChatManager, (r) => {
// Should Support newer versions
// Function consist of (num_1, args, bool_1, num_2, num_3)
export default (deletedMessagesArray) => before("updateRows", rowsController, (r) => {
	let rows = JSON.parse(r[1]);

	const { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha } = storage.colors;
	const { 
		useBackgroundColor, minimalistic, removeDismissButton, overrideIndicator, useIndicatorForDeleted,
		useEphemeralForDeleted
	} = storage.switches;
	const { deletedMessageBuffer, customIndicator } = storage.inputs;

	const bufferSymbol = " • ";

	function validateHex(input, defaultColor) {
		if(!input) input = defaultColor;

		const trimmedInput = input?.trim();
		if (trimmedInput.startsWith("#")) {
			const hexCode = trimmedInput.slice(1);

			if (/^[0-9A-Fa-f]{6}$/.test(hexCode)) {
				return "#" + hexCode.toUpperCase();
			}
		} 
		else {
			if (/^[0-9A-Fa-f]{6}$/.test(trimmedInput)) {
				return "#" + trimmedInput.toUpperCase();
			}
		}
		
		return defaultColor || "#000";
	}

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
					content: [{ content: content, type: "text"}],
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

	function updateEphemeralIndication(object, removeDismissText=false, overrideText=false, onlyYouText, overrideArray=[]) {
		if (object) {
			if(overrideText) {
				if (onlyYouText != undefined) {
					// ephemeralIndication.content[0]
					// Update "Only you can see this"
					object.content[0].content = onlyYouText+"  ";
				}
				else if(Array.isArray(overrideArray)) {
					object.content = overrideArray
				}
			}
			else {
				if (removeDismissText) {
					// Update "Dismiss message"
					object?.content?.splice?.(1)
				}				
			}
		}
		object.helpArticleLink = ""
		object.helpButtonAccessibilityLabel = "Hello, Antied here Again"

		return object;
	}

	rows.forEach((row) => {
		if(storage.debugUpdateRows) console.log(row);
		if(row?.type == 1) {
			if( deletedMessagesArray[row?.message?.id] ) {
				if(deletedMessageBuffer?.length > 0 || deletedMessageBuffer != "") {
					if(useIndicatorForDeleted && useEphemeralForDeleted) {
						row.message.ephemeralIndication = updateEphemeralIndication(
							row.message.ephemeralIndication, 
							undefined,
							true,
							`${deletedMessageBuffer}${bufferSymbol}`
						)
					} 
					else {
					   row.message.edited = deletedMessageBuffer;						
					}
				}
				
				if(minimalistic == false) {
					const characterColor = validateHex(textColor, "#E40303")
					// transformObject Broke on latest,  because usernameOnClick linkColor function seem gone
					// const appliedColor = transformObject(row?.message?.content, characterColor)
					// row.message.content = appliedColor;
					
					// Apparently i find workaround for textcoloring yay
					row.message.textColor = ReactNative.processColor(characterColor);
				}
				
				if(removeDismissButton && typeof row?.message?.ephemeralIndication == "object") {
					row.message.ephemeralIndication = updateEphemeralIndication(row.message.ephemeralIndication, true)
				}

				if(overrideIndicator) {
					row.message.ephemeralIndication = { 
						content: [], 
						helpArticleLink: "", 
						helpButtonAccessibilityLabel: "Hello, Antied here Again"
					};
				}
				else if (!useIndicatorForDeleted) {
					if(customIndicator?.length > 0 || customIndicator != "") {
						row.message.ephemeralIndication = updateEphemeralIndication(
							row.message.ephemeralIndication, 
							undefined,
							true,
							customIndicator
						)
					}
				}

				row.message.obscureLearnMoreLabel = "Hello, Antied here";

				if(minimalistic == false && useBackgroundColor == true) {
					
					const BG = validateHex( `${backgroundColor}`, "#FF2C2F" );
					const GC = validateHex( `${gutterColor}`, "#FF2C2F");
					
					row.backgroundHighlight ??= {};
					
					row.backgroundHighlight = {
						backgroundColor: ReactNative.processColor(`${BG}${backgroundColorAlpha}`),
						gutterColor: ReactNative.processColor(`${GC}${gutterColorAlpha}`)
					}
				}
			}
		}
	})

	r[1] = JSON.stringify(rows);
	return r[1];
});
