import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { UIElements } from "../../../lib/utility"

const { View, FormInput, FormDivider } = UIElements

const customizedableTexts = [
	{
		id: "deletedMessageBuffer",
		title: "Customize Deleted Message",
		type: "default",
		placeholder: "This message is deleted",
	},
	{
		id: "editedMessageBuffer",
		title: "Customize Edited Separator",
		type: "default",
		placeholder: "`[ EDITED ]`",
	},
	{
		id: "historyToast",
		title: "Customize Remove History Toast Message",
		type: "default",
		placeholder: "History Removed",
	},
	{
		id: "logLength",
		title: "Customize Log message length",
		type: "numeric",
		placeholder: "60",
	},
	{
		id: "logCount",
		title: "Customize Log Limit",
		type: "numeric",
		placeholder: "1000",
	}
]

export default function TextComponent({ styles }) {
	useProxy(storage)
	
	return (<>
		<View style={[styles.subText]}>{
			customizedableTexts?.map((obj, index) => {
				return (<>
					<FormInput
						title={obj?.title}
						keyboardType={obj?.type}
						placeholder={obj?.placeholder?.toString()}
						value={storage?.inputs[obj.id] ?? obj?.placeholder}
						onChange={(val) => (storage.inputs[obj.id] = val.toString())}
					/>
					{index !== customizedableTexts.length - 1 && <FormDivider />}
				</>)
			})
		}
		</View>
	</>)
}
