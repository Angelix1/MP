import { moment } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";

import { UIElements } from "../../../../lib/utility";
import { renderTimestamp } from "../../utils/customTimestamp";
import { SelectRow } from "../components/selectRow";
import { CustomTimeInputRow } from "../components/CustomTimeInputRow";

const { FormDivider, FormSwitchRow, FormRow } = UIElements;

let modes = [
	{
		label: "Calendar",
		key: "calendar"
	},
	{
		label: "Relative",
		key: "relative"
	},
	{
		label: "ISO 8601",
		key: "iso"
	},
	{
		label: "Custom",
		key: "custom",
		renderExtra: (selected) => <CustomTimeInputRow 
			value={storage.utils.customTimestamp.customFormat} 
			onChangeText={(t) => storage.utils.customTimestamp.customFormat = t} 
			placeholder="dddd, MMMM Do YYYY, h:mm:ss a" 
			disabled={!selected} 
		/>
	}
]


export default function customTimestampSetting() {
	useProxy(storage)
	
	const thisUtilStorage = storage.utils.customTimestamp;

	thisUtilStorage.selected ??= "calendar",
	thisUtilStorage.customFormat ??= "dddd, MMMM Do YYYY, h:mm:ss a",
	thisUtilStorage.separateMessages ??= false
	

	return (<>
		<FormRow label="Mode"/>
		{
			modes.map(({ label, key, renderExtra }, i) => {
				return (<>
					<SelectRow 
						label={label} 
						subLabel={renderTimestamp(moment(), key)} 
						selected={thisUtilStorage.selected === key} 
						onPress={() => thisUtilStorage.selected = key} 
					/>
					{renderExtra && renderExtra(thisUtilStorage.selected === key)}
					{i !== modes.length - 1 && <FormDivider />}
				</>)
			})
		}
		<FormSwitchRow
			label="Separate messages"
			subLabel="Always shows username, avatar and timestamp for each message"
			value={thisUtilStorage.separateMessages}
			onValueChange={(v) => {
				thisUtilStorage.separateMessages = v;
			}}
		/>
	</>)
}



