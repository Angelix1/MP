import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { plugin } from "@vendetta"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms, General } from "@vendetta/ui/components"

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

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
	}
]

export default function TextComponent({ styles }) {
	useProxy(storage)
	
	return (<>
		<View style={[styles.subText]}>
		{
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
		<FormInput
			title="Customize Plugin Name"
			keyboardType="default"
			placeholder={storage?.inputs?.customPluginName || plugin?.manifest?.name || "ANTIED"}
			value={storage?.inputs?.customPluginName}
			onChange={(val) => {
				storage.inputs.customPluginName = val.toString()
				plugin.manifest.name = val.toString()
			}}
		/>
		<FormDivider/>
		<FormRow
			label={`Current Used Icon - ${storage?.misc?.editHistoryIcon || "ic_edit_24px"}`}
			subLabel="Icon for Message History Removed toast"
			trailing={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName(storage?.misc?.editHistoryIcon)} />}
		/>
		<FormDivider/>
		<FormInput
			title="Icon Name"
			keyboardType="default"
			placeholder="ic_edit_24px"
			value={storage?.misc?.editHistoryIcon || "ic_edit_24px"}
			onChange={(val) => (storage.misc.editHistoryIcon = val.toString())}
		/>
		</View>
	</>)
}
