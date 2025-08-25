import { ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { findByProps } from '@vendetta/metro';

// const { DCDChatManager } = ReactNative.NativeModules;
const rowsController = findByProps("updateRows", "getConstants")


/*
	Time wasted: 3 hours 10 minutes
*/

// export default (deletedMessagesArray) => before("updateRows", DCDChatManager, (r) => {
// Should Support newer versions
// Function consist of (num_1, args, bool_1, num_2, num_3)
export default (deletedMessagesArray) => before("updateRows", rowsController, (r) => {
	
	// added this in 1.4.2 basically for safe guard against "cannot convert undefined value to object"
    if (!r || r.length <= 1 || typeof r[1] !== "string") {
        return r;
    }

    let rows;

    try {
        rows = JSON.parse(r[1]);
    } catch (e) {
		// another safeguard for if said r[1] is empty string or invalid stringified JSON
        console.error("JSON Parse failed in updateRows patch. Aborting.", e);
        return r;
    }

	const { textColor, backgroundColor, backgroundColorAlpha, gutterColor, gutterColorAlpha } = storage.colors;
	const { 
		useBackgroundColor, minimalistic, removeDismissButton, overrideIndicator, useIndicatorForDeleted,
		useEphemeralForDeleted
	} = storage.switches;

	const { deletedMessageBuffer, customIndicator } = storage.inputs;

	const bufferSymbol = " • ";

	function validateHex(input, defaultColor) {
		if(!input) input = defaultColor;

		// Handle cases where input might be a number or other non-string type
	    const trimmedInput = String(input).trim(); // Convert to string first

	    if (!trimmedInput) return defaultColor; // Check if it's empty after trimming

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

	function updateEphemeralIndication(object, removeDismissText=false, overrideText=false, onlyYouText, overrideArray=[]) {
		
		// Ensure object and object content exists and is an array
		if (object && Array.isArray(object.content)) {
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

	
	// simple safeguard if modification is faulty, we didnt push the modified rows
	try {
        r[1] = JSON.stringify(rows);
    } catch (e) {
        console.error("Failed to stringify modified rows. Aborting.", e);
        return r; // we return as is
    }


	return r; // idk why i just return r[1] when originally its arrays of r
});


/*
// Left over code from version before 235.xx, for later use case if this plugin use native modification
// might be useful who know and i dont want to recode it back if it needed

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


*/