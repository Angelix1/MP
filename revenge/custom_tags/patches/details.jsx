import { findByProps, findByStoreName, findByTypeNameAll } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";
import getTag, { BUILT_IN_TAGS } from "../lib/getTag";

const TagModule = findByProps("getBotLabel");
const getBotLabel = TagModule.getBotLabel;

const GuildStore = findByStoreName("GuildStore");

const rowPatch = ([{ guildId, user }], ret) => {
    console.log(ret)
    const tagComponent = findInReactTree(ret.props.label, (c) => c.type.Types)
    if (!tagComponent || !BUILT_IN_TAGS.includes(getBotLabel(tagComponent.props.type))) {
        const guild = GuildStore.getGuild(guildId)
        const tag = getTag(guild, undefined, user)

        if (tag) {
            if (tagComponent) {
                tagComponent.props = {
                    type: 0,
                    ...tag
                }
            } else {
                const row = findInReactTree(ret.props.label, (c) => c.props?.lineClamp).props.children
                row.props.children[1] = (<>
                    {" "}
                    <TagModule.default
                        type={0}
                        text={tag.text}
                        textColor={tag.textColor}
                        backgroundColor={tag.backgroundColor}
                        verified={tag.verified}
                    />
                </>)
            }
        }
    }
}

export default () => {
    const patches = []

    findByTypeNameAll("UserRow").forEach((UserRow) => patches.push(after("type", UserRow, rowPatch)))

    return () => patches.forEach((unpatch) => unpatch())
}