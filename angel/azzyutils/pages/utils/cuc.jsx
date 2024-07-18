import { storage } from "@vendetta/plugin"
import { numToHex, openSheet } from "../../../../lib/utility"
import { ReactNative } from "@vendetta/metro/common"
import { findByName } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms, General } from "@vendetta/ui/components";

const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated, Component } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

const switches = [
	{
		id: "enableReply",
		label: "Patch reply",
		subLabel: "also replace username color in mentioned referenced message",
		icon: null,
		def: false
	}
]

export default function CustomUsernameColorPage() {

	const SUCUC = storage?.utils?.customUsernameColor;

	const whenPressed = () => openSheet(
		CustomColorPickerActionSheet, {
			color: (ReactNative.processColor(SUCUC?.hex) || 0),
			onSelect: (color) => {
				const hex = numToHex(color)
				SUCUC.hex = hex
			//	showToast(storage.colors.hex)
			}
		}
	);

	return (<>
		<FormRow
			label="Color"
			subLabel="Click to Update"
			onPress={whenPressed}
			trailing={
				<TouchableOpacity onPress={whenPressed}>
					<Image
						source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII=' }}
						style={{ 
							width: 128, 
							height: 128,
							borderRadius: 10, 
							backgroundColor: SUCUC?.hex || "#000000"
						}}
					/>
				</TouchableOpacity>
			}
		/>
		<FormDivider />
		{ 
			switches?.map((obj, index) => {
				return (<>
					<FormRow 
						label={obj?.label}
						subLabel={obj?.subLabel}
						leading={obj?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(obj?.icon)} />}
						trailing={
							("id" in obj) ? (
								<FormSwitch
									value={storage?.utils?.customUsernameColor[obj?.id] ?? obj?.def}
									onValueChange={ (value) => (storage.utils.customUsernameColor[obj?.id] = value) }
									/>
							) : undefined
						}
					/>
					{index !== switches?.length - 1 && <FormDivider />}
				</>)
			})
		}
	</>)
}