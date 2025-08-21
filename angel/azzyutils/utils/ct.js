import { findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";

const UserStore = findByStoreName("UserStore");

export function patchCustomClanBadge(row) {
	if(row?.message) {

		if(UserStore?.getCurrentUser?.()?.id == row?.message?.authorId) {
			
			const CT = storage?.utils?.customClan;
			
			if(CT?.clanBadgeUrl && CT?.clanTag) {
				row.message.clanTag = (typeof(CT?.clanTag) == 'string' ? CT?.clanTag?.toUpperCase() : CT?.clanTag) || "AGWX";
				row.message.clanBadgeUrl = CT?.clanBadgeUrl || "https://cdn.discordapp.com/clan-badges/603970300668805120/e5926f1f8cf6592d56d27bac37f01a9b.png?size=32";
			}
		}

		return row;
	}
}
