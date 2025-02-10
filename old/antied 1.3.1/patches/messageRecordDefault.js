import { after } from "@vendetta/patcher";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';

const MessageRecord = findByName("MessageRecord", false);

export default () => after("default", MessageRecord, ([props], record) => {
	record.was_deleted = !!props.was_deleted;
})