import { logger, plugin } from "@vendetta";
import { findByStoreName } from "@vendetta/metro";
import { removePlugin } from "@vendetta/plugins";
import { safeFetch } from "@vendetta/utils";

const UserStore = findByStoreName("UserStore");
const myId = UserStore?.getCurrentUser?.()?.id;

/* Grab list from any url, cache it, and remove self if the user is blacklisted */
export async function fetchDB(url) {
	let list = [];
	try {
		const res = await safeFetch(url);
		if (res.ok) list = (await res.json())?.list ?? [];
	} 
	catch (e) {
		logger.info("No Data", e)
	}

	return { list };
}

export function selfDelete(blocklist, time = 10) {
	if (blocklist?.list?.some(id => String(id) === String(myId))) {
		setTimeout(() => {
			logger.info("[INFO] You are blacklisted from using this plugin.");
			removePlugin(plugin.id);
		}, time * 1000);	
	};	
}