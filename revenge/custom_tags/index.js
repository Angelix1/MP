import { storage } from "@vendetta/plugin";
import patchChat from "./patches/chat";
import patchDetails from "./patches/details";
import patchName from "./patches/name";
import patchSidebar from "./patches/sidebar";
import patchTag from "./patches/tag";
import Settings from "./settings";

let patches = [];

export default {
    onLoad: () => {
        storage.useRoleColor ??= false
        patches.push(patchChat())
        patches.push(patchTag())
        patches.push(patchName())
        patches.push(patchSidebar())
        patches.push(patchDetails())
    },
    onUnload: () => patches.forEach(unpatch => unpatch()),
    settings: Settings
}