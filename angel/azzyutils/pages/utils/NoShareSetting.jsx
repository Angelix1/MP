import { storage } from "@vendetta/plugin"
import { UIElements } from "../../../../lib/utility"


const { FormRow, FormSwitch } = UIElements

export default function NoShareSetting() {
	
	return (<>
		<FormRow
			label="Add Save Image Button to Message ActionSheet"
			trailing={
				<FormSwitch
					value={storage?.utils?.noshare?.addSaveImage || false}
					onValueChange={(value) => {
					storage.utils.noshare.addSaveImage = value
				}}
				/>
			}
		/>
	</>)
}