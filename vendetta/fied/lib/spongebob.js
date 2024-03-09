export function mockingSpongeBobSpeak(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        // Randomly convert characters to uppercase or lowercase
        result += Math.random() < 0.5 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    return result;
}