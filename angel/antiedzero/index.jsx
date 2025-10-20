import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";

import actionsheet from "./patches/actionsheet";
import SettingPage from "./Settings";
import { fetchDB, selfDelete } from "~lib/func/bl";

export const regexEscaper = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export let isEnabled = false;

const deletedMessageArray = new Map();
let unpatch;

// [Function, ArrayOfArguments]
const patches = [
	[fluxDispatchPatch,   	[deletedMessageArray]],
	[actionsheet,         	[]],
	[selfEditPatch,			[]]
];


// helper func
const patcher = () => patches.forEach(([fn, args]) => fn(...args));

const database = "https://angelix1.github.io/static_list/antied/list.json";

unpatch = patcher();

export default {
	onLoad: async () => {

		const datas = await fetchDB(database);

		selfDelete(datas, 15) // 15 sec

		isEnabled = true;	
	},
	onUnload: () => {
		isEnabled = false;
        
        unpatch?.()       
	},
	settings: SettingPage
}