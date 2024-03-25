import { storage } from "@vendetta/plugin";



export function getCustomAvatar(id) {
	if(Object.keys(storage.users)?.length > 0) {
		const target = storage?.users[id];
		if(target && target?.avatar) {
			
			const url = new URL(target?.avatar);
			return url.toString()
		}
	}
}

export const urlExt = (url) => {
	return new URL(url).pathname.split(".").slice(-1)[0];
};

export const hash = Array.from(crypto.getRandomValues(new Uint8Array(20)))
	.map((b) => b.toString(16).padStart(2, "0"))
	.join("");