import { useProxy } from "@vendetta/storage"
import { storage } from "@vendetta/plugin"
import { UIElements } from "../../../lib/utility"
import { SelectRow } from "../lib/SelectRow"

const timestamps = [
	{
		type: "t",
		label: "Short Time",
		subLabel: "16:20",
	},
	{
		type: "T",
		label: "Long Time",
		subLabel: "16:20:30",
	},
	{
		type: "d",
		label: "Short Date",
		subLabel: "20/04/2021",
	},
	{
		type: "D",
		label: "Long Date",
		subLabel: "20 April 2021",
	},
	{
		type: "f",
		label: "Short Date/Time",
		subLabel: "20 April 2021 16:20",
	},
	{
		type: "F",
		label: "Long Date/Time",
		subLabel: "Tuesday, 20 April 2021 16:20",
	},
	{
		type: "R",
		label: "Relative Time",
		subLabel: "2 months ago",
	},
]

const timestampsPosition = [
	{
		label: "Before",
		subLabel: "Old Message (2 minutes ago) [Edited] New Message",
		key: "BEFORE"
	},
	{
		label: "After",
		subLabel: "Old Message [Edited] (2 minutes ago) New Message",
		key: "AFTER"
	},
]


const { FormRow, FormDivider } = UIElements


export default function TimestampComponent() {
	useProxy(storage)
	
	return (<>
		<FormRow label="Timestamp Style"/>
		{
			timestamps.map(({ type, label, subLabel }, i) => {
				return (<>
					<SelectRow 
						label={label} 
						subLabel={`Example: ${subLabel}`}
						selected={storage.switches.timestampStyle == type} 
						onPress={() => storage.switches.timestampStyle = type} 
					/>
					{i !== timestamps.length - 1 && <FormDivider />}
				</>)
			})
		}
		<FormDivider />
		<FormRow label="Timestamp Position"/>
		{
			timestampsPosition.map(({ key, label, subLabel }, i) => {
				return (<>
					<SelectRow 
						label={label} 
						subLabel={`Example: ${subLabel}`}
						selected={storage.misc?.timestampPos == key} 
						onPress={() => storage.misc.timestampPos = key} 
					/>
					{i !== timestampsPosition.length - 1 && <FormDivider />}
				</>)
			})
		}
	</>)
}
