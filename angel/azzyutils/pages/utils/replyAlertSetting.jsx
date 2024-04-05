import { useProxy } from "@vendetta/storage";
import { UIElements, numToHex, openSheet, transparentBase64 } from "../../../../lib/utility"
import { storage } from "@vendetta/plugin";
import { ReactNative } from "@vendetta/metro/common";
import { logger } from "@vendetta";
import { findByName } from "@vendetta/metro";


const { 
	ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated, 
	FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, 
	FormSection, FormDivider, FormInput, FormRadioRow 
} = UIElements;

const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");


export default function ReplyAlertSetting() {
	useProxy(storage)
	const reply = storage.utils.replyAlert;

	const colorSet = () => openSheet(
		CustomColorPickerActionSheet, {
			color: (ReactNative.processColor(reply?.customColor) || 0),
			onSelect: (color) => {
				const hex = numToHex(color)
				
				reply.customColor = hex
			
				if(storage?.debug) logger.log("Reply Alert Color", "[Changed]", hex);
			}
		}
	);


	return (<>
		<FormRow
			label="Use Custom Color Mentions"
			trailing={
				<FormSwitch
					value={reply?.useCustomColor || false}
					onValueChange={(value) => {
						reply.useCustomColor = value
					}}
				/>
			}
		/>
		<FormDivider />
		<FormRow
			label="Color"
			subLabel="Click to Update"
			onPress={colorSet}
			trailing={
				<TouchableOpacity onPress={colorSet}>
					<Image 
						source={{ uri: transparentBase64 }}
						style={{ 
							width: 128, 
							height: 128,
							borderRadius: 10, 
							backgroundColor: (reply?.customColor || "#000")
						}}
					/>
				</TouchableOpacity>
			}
		/>
	</>)
}