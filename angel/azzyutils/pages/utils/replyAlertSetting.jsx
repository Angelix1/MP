import { useProxy } from "@vendetta/storage";
import { UIElements, convert, numToHex, openSheet, transparentBase64 } from "../../../../lib/utility"
import { storage } from "@vendetta/plugin";
import { React, ReactNative } from "@vendetta/metro/common";
import { logger } from "@vendetta";
import { findByName } from "@vendetta/metro";


const { 
	ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated, 
	FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, 
	FormSection, FormDivider, FormInput, FormRadioRow, FormSliderRow
} = UIElements;

const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");


export default function ReplyAlertSetting() {
	useProxy(storage)
	const reply = storage.utils.replyAlert;

	const [CA, setCA] = React.useState(
		convert.toDecimal(
			convert.hexAlphaToPercent(reply.colorAlpha) || 100)
		)

	const [GA, setGA] = React.useState(
		convert.toDecimal(
			convert.hexAlphaToPercent(reply.gutterAlpha) || 100)
		)

	const colorSet = () => openSheet(
		CustomColorPickerActionSheet, {
			color: (ReactNative.processColor(reply?.customColor) || 0),
			onSelect: (color) => {
				const hex = numToHex(color)
				
				reply.customColor = hex
			
				if(storage?.debug) logger.log("Reply Alert BG Color", "[Changed]", hex);
			}
		}
	);

	const gutterSet = () => openSheet(
		CustomColorPickerActionSheet, {
			color: (ReactNative.processColor(reply?.customColor) || 0),
			onSelect: (color) => {
				const hex = numToHex(color)
				
				reply.gutterColor = hex
			
				if(storage?.debug) logger.log("Reply Alert Gutter Color", "[Changed]", hex);
			}
		}
	);

	return (<>
		<FormRow
			label="Toggle Force Alert"
			subLabel="When someone replying to your message with mention disabled, this option will force ping you"
			trailing={
				<FormSwitch
					value={reply?.useReplyAlert || true}
					onValueChange={(value) => {
						reply.useReplyAlert = value
					}}
				/>
			}
		/>
		<FormDivider />
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
			label="Ignore self Reply"
			subLabel="When replying to own message, do not ping"
			trailing={
				<FormSwitch
					value={reply?.ignoreSelf || false}
					onValueChange={(value) => {
						reply.ignoreSelf = value
					}}
				/>
			}
		/>
		<FormDivider />
		<FormRow 
			label="Preview"
			subLabel="How it looks in then chat"
		/>
		<View style={[{
			flexDirection: "row", 
			height: 80,
			width: "100%", 
			overflow: "hidden", 
			borderRadius: 12,
			marginBottom: 20,
			marginRight: 10,
			marginLeft: 10
		}]}>
			<View style={{ 
				width: "2%",
				backgroundColor: `${reply?.gutterColor}${convert.alphaToHex(convert.toPercentage(GA))}`,
			}}/>
			<View style={{ 
				flex: 1,
				backgroundColor: `${reply?.customColor}${convert.alphaToHex(convert.toPercentage(CA))}`,
				justifyContent: 'center', 
				alignItems: 'center',
			}}>
				<Text style={{ fontSize: 20, color: "#FFFFFF" }}> Example White Text </Text>
				<Text style={{ fontSize: 20, color: "#000000" }}> Example Black Text </Text>									
			</View>
		</View>
		<FormDivider />
		<FormRow
			label="Background Color"
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
		<FormDivider />
		<FormRow
			label="Gutter Color"
			subLabel="Click to Update"
			onPress={gutterSet}
			trailing={
				<TouchableOpacity onPress={gutterSet}>
					<Image 
						source={{ uri: transparentBase64 }}
						style={{ 
							width: 128, 
							height: 128,
							borderRadius: 10, 
							backgroundColor: (reply?.gutterColor || "#000")
						}}
					/>
				</TouchableOpacity>
			}
		/>
		<FormDivider />

		<FormSliderRow
			label={`Background Color Alpha: ${convert.toPercentage(CA)}%`}
			value={CA}
			style={{ width: "90%" }}
			onValueChange={(v) => {
				setCA(Number(convert.formatDecimal(v)))
				reply.colorAlpha = convert.alphaToHex(convert.toPercentage(v));
			}}
		/>
		<FormDivider />
		<FormSliderRow
			label={`Gutter Color Alpha: ${convert.toPercentage(GA)}%`}
			value={GA}
			style={{ width: "90%" }}
			onValueChange={(v) => {
				setGA(Number(convert.formatDecimal(v)))
				reply.gutterAlpha = convert.alphaToHex(convert.toPercentage(v));
			}}
		/>
	</>)
}