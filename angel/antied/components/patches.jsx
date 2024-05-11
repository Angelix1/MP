import { storage } from "@vendetta/plugin"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { useProxy } from "@vendetta/storage"
import { UIElements } from "../../../lib/utility"

const { View, FormRow, FormIcon, FormSwitch, FormDivider } = UIElements

const togglePatch = [
	{
		id: "enableMD",
		default: true,
		label: "Toggle Message Delete",
		subLabel: "Logs deleted message",
	},
	{
		id: "enableMU",
		default: true,
		label: "Toggle Message Update",
		subLabel: "Logs edited message",
	},
	{
		id: "enableLogging",
		default: false,
		label: "Toggle Antied Logging",
		subLabel: "Save Logs to plugin's storage",
	},
	{
		id: "logWarning",
		default: false,
		label: "Toggle Exceeding Log Limit Warning",
		subLabel: "Warn if log limit exceed",
	}
]

export default function PatchesComponent({ styles }) {
	useProxy(storage)
	
	return (<>
		<View style={[styles.subText]}>{
			togglePatch?.map((obj, index) => {
				return (<>
					<FormRow 
						label={obj?.label}
						subLabel={obj?.subLabel}
						leading={obj?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(obj?.icon)} />}
						trailing={
							("id" in obj) ? (
								<FormSwitch
								value={storage?.switches[obj?.id] ?? obj?.default}
								onValueChange={ (value) => (storage.switches[obj?.id] = value) }
								/>
							) : undefined
						}
					/>
					{index !== togglePatch?.length - 1 && <FormDivider />}
				</>)
			})
		}				
		</View>
	</>)
}
