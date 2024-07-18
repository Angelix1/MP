import { storage } from "@vendetta/plugin"
import { Forms } from "@vendetta/ui/components"


const { FormRow, FormSwitch } = Forms

export default function NoShareSetting() {
	
	return (<>
		<FormRow
			label="Add Save Image Button to Image ActionSheet"
			subLabel="if Built-in Save Image gone"
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