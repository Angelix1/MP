import { findByProps, findByStoreName } from "@vendetta/metro"
import { after } from "@vendetta/patcher"
import { findInReactTree } from "@vendetta/utils"
import getTag, { BUILT_IN_TAGS } from "../lib/getTag"

const Rows = findByProps("GuildMemberRow")

const TagModule = findByProps("getBotLabel");
const getBotLabel = TagModule.getBotLabel;

const GuildStore = findByStoreName("GuildStore");

export default () => after("type", Rows.GuildMemberRow, ([{ guildId, channel, user }], ret) => {
    const tagComponent = findInReactTree(ret, (c) => c.type.Types)
    if (!tagComponent || !BUILT_IN_TAGS.includes(getBotLabel(tagComponent.props.type))) {
        const guild = GuildStore.getGuild(guildId)
        const tag = getTag(guild, channel, user)

        if (tag) {
            if (tagComponent) {
                tagComponent.props = {
                    type: 0,
                    ...tag
                }
            } else {
                const row = findInReactTree(ret, (c) => c.props.style.flexDirection === "row")
                row.props.children.splice(2, 0,
                    <TagModule.default
                        type={0}
                        text={tag.text}
                        textColor={tag.textColor}
                        backgroundColor={tag.backgroundColor}
                        verified={tag.verified}
                    />
                )
            }
        }
    }
})