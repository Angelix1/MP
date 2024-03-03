export function toLeetSpeak(text) {
    const leetMap = {
        'a': '4', 'A': '4',
        'b': '8', 'B': '8',
        'e': '3', 'E': '3',
        'g': '6', 'G': '6',
        'l': '1', 'L': '1',
        'o': '0', 'O': '0',
        's': '5', 'S': '5',
        't': '7', 'T': '7'
    };
    let leetText = '';
    for (let char of text) {
        leetText += leetMap[char] || char;
    }
    return leetText;
}