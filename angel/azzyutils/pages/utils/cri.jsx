import { storage } from "@vendetta/plugin"
import { numToHex, openSheet, UIElements } from "../../../../lib/utility"
import { ReactNative } from "@vendetta/metro/common"
import { findByName } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";

const defaultImageURL = 'https://cdn.discordapp.com/role-icons/1222207470714486825/bc3ef24c3f220155f90e55cc0cb0d0cf.png?size=512'
const { FormRow, FormSwitch, TouchableOpacity, Image, FormDivider, FormIcon, FormInput } = UIElements

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
	
	return (<>
		<FormRow
			label="Icon Preview"
			trailing={
				<Image
					source={{ uri: defaultImageURL }}
					style={{ 
						width: 128, 
						height: 128,
						borderRadius: 10, 
					}}
				/>
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