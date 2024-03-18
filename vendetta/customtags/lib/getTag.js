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
	
	const customTag = storage?.customTags;

	const BuiltInReplace = storage?.builtInReplace;
	const BuiltInDefault = storage?.builtInDefault;



	let usedTags = [...BuiltInReplace]


	if(storage?.toggle?.useDefaultTag) {
		usedTags.push(...BuiltInDefault)
	}
	
	if(storage?.toggle?.useCustomTags) {
		usedTags.push(...customTag)
	}

	for (const tag of usedTags) {
		if(
			tag.condition?.(guild, channel, user) || 
			tag.permissions?.some(perm => permissions?.includes(perm))
		) {
			let backgroundColor, textColor;

            // let roleColor = storage.useRoleColor ? GuildMemberStore.getMember(guild?.id, user.id)?.colorString : undefined
            // let backgroundColor = roleColor ? roleColor : tag.backgroundColor ?? rawColors.BRAND_500
            // let textColor = (roleColor || !tag.textColor) ? (chroma(backgroundColor).get('lab.l') < 70 ? rawColors.WHITE_500 : rawColors.BLACK_500) : tag.textColor


			if(storage.useRoleColor) {
				backgroundColor = GuildMemberStore.getMember(guild?.id, user.id)?.colorString;
				textColor = chroma(backgroundColor).get('lab.l') < 70 ? rawColors.WHITE_500 : rawColors.BLACK_500;
			}
			else {
				backgroundColor = tag?.backgroundColor || tag?.colors?.bg?.hex || rawColors.BRAND_500;
				textColor = tag?.colors?.text?.hex || tag.textColor || rawColors.BRAND_500;
			}

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