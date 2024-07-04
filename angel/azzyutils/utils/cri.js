import { findByStoreName } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";

const UserStore = findByStoreName("UserStore");

export function patchCustomRoleIcon(row) {
	if(row?.message) {

		let CRI = storage?.utils?.customRoleIcon || {
			name: "BlobCatSip",
			source: 'https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512',
			alt: 'Role icon, BlobCatSip',
			size: 18,
		};

		CRI.alt ??= `Role icon, ${CRI.name}`

		row.message.roleIcon = CRI;

		return row;
	}
}
