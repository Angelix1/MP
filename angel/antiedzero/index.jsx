import fluxDispatchPatch from "./patches/flux_dispatch";
import selfEditPatch from "./patches/self_edit";

import actionsheet from "./patches/actionsheet";
import SettingPage from "./Settings";

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

unpatch = patcher();

export default {
	onLoad: () => {
		isEnabled = true;	
	},
	onUnload: () => {
		isEnabled = false;
        
        unpatch?.()       
	},
	settings: SettingPage
}