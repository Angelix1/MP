import { after } from "@vendetta/patcher";
import { isEnabled } from "..";
import { removeDecorGetUser } from "../utils/removeDecor";
import { findByStoreName } from "@vendetta/metro";

const UserStore = findByStoreName('UserStore');

export const getUser = () => after('getUser', UserStore, (_, user) => {
	if(isEnabled) {
		removeDecorGetUser(user);
	}	
})

