import { after } from "@vendetta/patcher";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';

import { isEnabled } from "..";

const MessageRecord = findByName("MessageRecord", false);

export default () => after("default", MessageRecord, ([props], record) => {
	if(isEnabled) {
		record.was_deleted = !!props.was_deleted;
	}
})