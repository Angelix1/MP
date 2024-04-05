import { storage } from "@vendetta/plugin"
import { UIElements } from "../../../../lib/utility"


const { FormRow, FormSwitch } = UIElements

export default function EML() {
	
	return (<>
		<FormRow
			label="Bypass Antied Logging"
			trailing={
				<FormSwitch
					value={storage?.utils?.eml?.logEdit || false}
					onValueChange={(value) => {
					storage.utils.eml.logEdit = value
				}}
				/>
			}
		/>
	</>)
}