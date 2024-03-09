import { emoji } from "./emoji";
import { toLeetSpeak } from "./leet";
import { mockingSpongeBobSpeak } from "./spongebob";
import * as uwu from "./uwu";
import { zalgofied } from "./zalgo";

export const transform = {
    emojify: emoji,
    leetify: toLeetSpeak,
    spongify: mockingSpongeBobSpeak,
    uwu: uwu,
    zalgofy: zalgofied,
};
