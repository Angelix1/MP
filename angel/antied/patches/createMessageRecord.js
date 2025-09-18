import { isEnabled } from "..";

import { after } from "@vendetta/patcher";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';

const MessageRecordUtils = findByProps("updateMessageRecord", "createMessageRecord");

export default () => after("createMessageRecord", MessageRecordUtils, function ([message], record) {
	if(isEnabled) {
		record.was_deleted = message.was_deleted;
	}
})