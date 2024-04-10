// import { findByName, findByStoreName } from "@vendetta/metro";
// import { after, instead } from "@vendetta/patcher";


// const UserStore = findByStoreName('UserStore');
// const ImageResolver = findByProps('getAvatarDecorationURL', 'default');

export function removeDecorGetUser(user) {
	if(user?.avatarDecorationData && storage?.toggle?.removeDecor) {
		user.avatarDecorationData = null;
	}	
	return user	
}

/*
export function removeDecorGetAvatarDecorationURL() {
	return
}


// ============ Patches [Ripped from DECOR plugin as reference]

	after('getUser', UserStore, (_, user) => {
		const store = useUsersDecorationsStore.getState();

		if (user && store.has(user.id)) {
			const decoration = store.get(user.id);

			if (decoration && user.avatarDecoration?.skuId !== SKU_ID) {
				user.avatarDecoration = {
					asset: decoration,
					skuId: SKU_ID
				};
			} else if (!decoration && user.avatarDecoration && user.avatarDecoration?.skuId === SKU_ID) {
				user.avatarDecoration = null;
			}

			user.avatarDecorationData = user.avatarDecoration;
		}
	})
	
	instead('getAvatarDecorationURL', ImageResolver, (args, orig) => {
		const [{avatarDecoration, canAnimate}] = args;
		if (avatarDecoration?.skuId === SKU_ID) {
			const parts = avatarDecoration.asset.split("_");
			if (!canAnimate && parts[0] === "a") parts.shift();
			return CDN_URL + `/${parts.join("_")}.png`;
		} else if (avatarDecoration?.skuId === RAW_SKU_ID) {
			return avatarDecoration.asset;
		} else {
			return orig(...args);
		}
	})
*/