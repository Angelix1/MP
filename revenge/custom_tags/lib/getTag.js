import { findByProps, findByStoreName } from "@vendetta/metro";
import { chroma, constants, i18n } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { rawColors } from "@vendetta/ui";

// Permissions
const { Permissions } = constants
const { computePermissions } = findByProps("computePermissions", "canEveryoneRole")

const GuildMemberStore = findByStoreName("GuildMemberStore")

export const BUILT_IN_TAGS = [
    i18n.Messages.AI_TAG,
    //Messages.BOT_TAG_BOT, This is done in our own tags as webhooks use this
    i18n.Messages.BOT_TAG_SERVER,
    i18n.Messages.SYSTEM_DM_TAG_SYSTEM,
    i18n.Messages.GUILD_AUTOMOD_USER_BADGE_TEXT,
    i18n.Messages.REMIXING_TAG
]

const tags = [
    {
        text: "WEBHOOK",
        condition: (guild, channel, user) => user.isNonUserBot()
    },

    {
        text: "OWNER",
        backgroundColor: rawColors.ORANGE_345,
        condition: (guild, channel, user) => guild?.ownerId === user.id
    },
    {
        text: i18n.Messages.BOT_TAG_BOT,
        condition: (guild, channel, user) => user.bot,
        verified: (guild, channel, user) => user.isVerifiedBot()
    },
    {
        text: "ADMIN",
        backgroundColor: rawColors.RED_560,
        permissions: ["ADMINISTRATOR"]
    },
    {
        text: "MANAGER",
        backgroundColor: rawColors.GREEN_345,
        permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
    },
    {
        text: "MOD",
        backgroundColor: rawColors.BLUE_345,
        permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]
    }
]

export default function getTag(guild, channel, user) {
    let permissions
    if (guild) {
        const permissionsInt = computePermissions({
            user: user,
            context: guild,
            overwrites: channel?.permissionOverwrites
        })
        permissions = Object.entries(Permissions)
            .map(([permission, permissionInt]) => permissionsInt & permissionInt ? permission : "")
            .filter(Boolean)
    }

    for (const tag of tags) {
        if (tag.condition?.(guild, channel, user) ||
            tag.permissions?.some(perm => permissions?.includes(perm))) {

            let roleColor = storage.useRoleColor ? GuildMemberStore.getMember(guild?.id, user.id)?.colorString : undefined
            let backgroundColor = roleColor ? roleColor : tag.backgroundColor ?? rawColors.BRAND_500
            let textColor = (roleColor || !tag.textColor) ? (chroma(backgroundColor).get('lab.l') < 70 ? rawColors.WHITE_500 : rawColors.BLACK_500) : tag.textColor

            return {
                ...tag,
                textColor,
                backgroundColor,
                verified: typeof tag.verified === "function" ? tag.verified(guild, channel, user) : tag.verified ?? false,
                condition: undefined,
                permissions: undefined
            }
        }
    }
}