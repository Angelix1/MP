/* regexPatterns */
export const regexPatterns = [
	'((http|https):\\/\\/)?([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?',
	'<?:?(?:(a):)?(\w{2,32}):(\d{17,19})?>?',
	'<@!?(?<id>\\d{17,20})>',
	'<@!?(?<id>\\d{17,20})>',
	'<#(?<id>\\d{17,20})>',
	'<@&(?<id>\\d{17,20})>',
	'<(?<animated>a)?:(?<name>\\w{2,32}):(?<id>\\d{17,20})>',
	'<:(?<name>\\w{2,32}):(?<id>\\d{17,20})>',
	'<t:(?<timestamp>-?\\d{1,13})(:(?<style>[DFRTdft]))?>',
	'<t:(?<timestamp>-?\\d{1,13})>',
	'<t:(?<timestamp>-?\\d{1,13}):(?<style>[DFRTdft])>',
	'<id:\\w+>',
	'@(everyone|here)'
];

const UUIDAlt = '<@(?<id>\\d{17,20})>';
const slashcommand = "'<\/(?<fullName>(?<name>[-_\\p{Letter}\\p{Number}\\p{sc=Deva}\\p{sc=Thai}]{1,32})(?: (?<subcommandOrGroup>[-_\\p{Letter}\\p{Number}\\p{sc=Deva}\\p{sc=Thai}]{1,32}))?(?: (?<subcommand>[-_\\p{Letter}\\p{Number}\\p{sc=Deva}\\p{sc=Thai}]{1,32}))?):(?<id>\\d{17,20})>'"


export function processText(inputString, regexArray) {
    const resultArray = [];
    let remainingText = inputString;
    
    function createObj(text, match) {
        return { match, text }
    }

    regexArray.forEach(regex => {
        const regexWithFlags = new RegExp(regex, 'u');
        let match = regexWithFlags.exec(remainingText);
        while (match !== null) {
            const matchIndex = match.index;
            const matchedString = match[0];
            const beforeMatch = remainingText.substring(0, matchIndex);
            const afterMatch = remainingText.substring(matchIndex + matchedString.length);
            
            resultArray.push(
                createObj(beforeMatch, false), 
                createObj(matchedString, true)
            )
            remainingText = afterMatch;
            match = regexWithFlags.exec(remainingText);
        }
    });

    if (remainingText.length > 0) {
        resultArray.push(createObj(remainingText, false));
    }

    return resultArray;
}


export function modifyText(arrayOfProcessedText, joiner, innerFunction) {
    const temp = []
    
    for(const strObj of arrayOfProcessedText) {
        
        if(!strObj?.match && strObj?.text) {
            temp.push(
            	innerFunction(strObj?.text)
            )
        } 
        else {
            temp.push(strObj?.text)
        }
    }

    return temp.join(joiner || "")
}
