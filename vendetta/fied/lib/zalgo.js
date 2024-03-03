export function zalgofied(string) {
    if(!string) return null;
    const obj = {
        a: '𝖺', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎',
        f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓',
        k: '𝚔', l: '𝚕', m: '𝚖', n: '𝚗', o: '𝗈',
        p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝',
        u: '𝗎', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢',
        z: '𝚣',
    };

    for (const char in obj) {
        string = string.split(char).join(obj[char]);
    }
    return string;
}