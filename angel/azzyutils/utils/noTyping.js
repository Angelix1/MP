import { instead } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";

const Typing = findByProps("startTyping");

export const startTyping = () => instead("startTyping", Typing, () => {});
export const stopTyping = () => instead("stopTyping", Typing, () => {});