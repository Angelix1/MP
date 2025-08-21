import { storage } from "@vendetta/plugin"
import { numToHex, openSheet } from "../../../../lib/utility"
import { clipboard, ReactNative } from "@vendetta/metro/common"
import { findByName } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { Forms, General } from "@vendetta/ui/components";

const defaultImageURL = 'https://cdn.discordapp.com/clan-badges/603970300668805120/e5926f1f8cf6592d56d27bac37f01a9b.png?size=32'

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated, Component } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

const textInput = [
	{
		id: "clanTag",
		label: "Tag Name",
		keyType: "default",
		placeholder: "AGWX",
		def: "AGWX"
	},
	{
		id: "clanBadgeUrl",
		label: "Badge Url",
		keyType: "default",
		placeholder: defaultImageURL,
		def: defaultImageURL
	}
]


export default function CustomRoleIconPage() {

	const SUCRI = storage?.utils?.customClan
	
	const copyDefaultURL = () => {
		clipboard.setString(defaultImageURL)
		showToast("Copied placeholder URL", getAssetIDByName("toast_copy_link"))
	}

	return (<>
		<FormRow
			label="Icon Preview"		
			trailing={
				<TouchableOpacity onPress={copyDefaultURL}>
					<Image
						source={{ uri: SUCRI?.clanBadgeUrl || defaultImageURL }}
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