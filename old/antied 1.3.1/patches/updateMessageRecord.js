import { instead } from "@vendetta/patcher";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';

const MessageRecordUtils = findByProps("updateMessageRecord", "createMessageRecord");

export default () => instead("updateMessageRecord", MessageRecordUtils, function ([oldRecord, newRecord], orig) {
	if (newRecord.was_deleted) {
		return MessageRecordUtils.createMessageRecord(newRecord, oldRecord.reactions);
	}
	return orig.apply(this, [oldRecord, newRecord]);
})