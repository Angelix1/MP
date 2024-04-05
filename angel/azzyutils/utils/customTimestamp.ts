import type { moment } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";


export interface Mode {
	label: string;
	key: "calendar" | "relative" | "custom" | "iso";
	renderExtra?: (selected: boolean) => JSX.Element;
}

export function renderTimestamp(timestamp: typeof moment.fn, mode: Mode['key'] = storage.selected) {
	switch (mode) {
	case "calendar":
		return timestamp.calendar();
	case "relative":
		return timestamp.fromNow();
	case "iso":
		return timestamp.toISOString();
	case "custom":
		return timestamp.format(storage.customFormat);
	}
}




export const ctimePatch = {
	beforePatch(row, momentjs) {
		if (row.rowType === 1) {
			if (storage.separateMessages) row.isFirst = true;
			row.message.__customTimestamp = renderTimestamp(row.message.timestamp)
		} 
		else if (row.rowType === "day") {
			row.text = renderTimestamp(momentjs(row.text, "LL"))
		}	
	},
	afterPatch(row) {

		if (row.rowType !== 1) return;
		if (
			row?.message?.__customTimestamp && 
			row?.message?.state === "SENT" && 
			row?.message?.timestamp
		) {
			row.message.message.timestamp = row?.message?.__customTimestamp
		}
	}
}