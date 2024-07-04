import { findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";

const UserStore = findByStoreName("UserStore");

export function patchCustomRoleIcon(row) {
	if(row?.message) {

		if(UserStore?.getCurrentUser?.()?.id == row?.message?.authorId) {
			
			const CRI = storage?.utils?.customRoleIcon;
			let roleIconObject = {};

			if(!CRI?.name && !CRI?.source && !CRI?.size) {
				roleIconObject = {
					name: "BlobCatSip",
					source: 'https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512',
					alt: 'Role icon, BlobCatSip',
					size: 18,
				}
			}
			else {
				roleIconObject.name = CRI.name;
				roleIconObject.source = CRI.source;
				roleIconObject.size = CRI.size;
				roleIconObject.alt = `Role icon, ${CRI.name}`;
			}

			row.message.roleIcon = roleIconObject;
		}

		return row;
	}
}
