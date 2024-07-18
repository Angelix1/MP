import { storage } from "@vendetta/plugin"
import { numToHex, openSheet } from "../../../../lib/utility"
import { clipboard, ReactNative } from "@vendetta/metro/common"
import { findByName } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { Forms, General } from "@vendetta/ui/components";

const defaultImageURL = 'https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512'

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated, Component } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

const textInput = [
	{
		id: "name",
		label: "Role Icon Name",
		keyType: "default",
		placeholder: "BlobCatSip",
		def: "BlobCatSip"
	},
	{
		id: "source",
		label: "Role Icon Image Url",
		keyType: "default",
		placeholder: "https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512",
		def: defaultImageURL
	},
	{
		id: "size",
		label: "Size of the Image",
		keyType: "number",
		placeholder: "18",
		def: 18
	}
]


export default function CustomRoleIconPage() {

	const SUCRI = storage?.utils?.customRoleIcon;
	
	const copyDefaultURL = () => {
		clipboard.setString("https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512")
		showToast("Copied placeholder URL", getAssetIDByName("toast_copy_link"))
	}

	return (<>
		<FormRow
			label="Icon Preview"		
			trailing={
				<TouchableOpacity onPress={copyDefaultURL}>
					<Image
						source={{ uri: SUCRI?.source || defaultImageURL }}
						style={{ 
							width: 128, 
							height: 128,
							borderRadius: 10, 
						}}
					/>
				</TouchableOpacity>
			}
		/>
		<FormDivider />
		{ 
			textInput?.map((obj, index) => {
				return (<>
					<FormInput
						title={obj.label}
						keyboardType={obj?.keyType}
						placeholder={obj?.placeholder}
						value={SUCRI[obj?.id] ?? obj?.def}
						onChange={(val) => (SUCRI[obj?.id] = val.toString())}
					/>
					{index !== textInput?.length - 1 && <FormDivider />}
				</>)
			})
		}
	</>)
}