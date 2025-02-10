import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { NavigationNative, React } from "@vendetta/metro/common"
import { findByName } from "@vendetta/metro"
import { rawColors, semanticColors } from "@vendetta/ui"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { Forms, General } from "@vendetta/ui/components";

import SemRawComponent from "./semRaw"
import { colorConverter, convert, openSheet, transparentBase64 } from "../../../lib/utility"

const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");

const { alphaToHex, hexAlphaToPercent, toPercentage, toDecimal, formatDecimal } = convert;

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

const customizeableColors = [
	{
		id: "textColor",
		label: "Deleted Message Text Color",
		subLabel: "Click to customize Deleted Message Text Color",
		defaultColor: "#E40303",
	},
	{
		id: "backgroundColor",
		label: "Deleted Message Background Color",
		subLabel: "Click to customize Background Color",
		defaultColor: "#FF2C2F",
	},
	{
		id: "gutterColor",
		label: "Deleted Message Background Gutter Color",
		subLabel: "Click to customize Background Gutter Color",	
		defaultColor: "#FF2C2F",
	}
]

export default function ColorPickComponent({ styles }) {
	useProxy(storage)

	const [BGAlpha, setBGAlpha] = React.useState(
		toDecimal( hexAlphaToPercent(storage?.colors?.backgroundColorAlpha) ?? 100 )
	);
	const [gutterAlpha, setGutterAlpha] = React.useState(
		toDecimal( hexAlphaToPercent(storage?.colors?.gutterColorAlpha) ?? 100 )
	);

	const navigation = NavigationNative.useNavigation();

	const parseColorPercentage = clr => alphaToHex(toPercentage(clr));

	const handleSemRaw = prefix => {
		if(!prefix) return null;
		const [pref, col] = prefix.split('.');

		if(pref == "semanticColors") {
			return semanticColors[col];
		} else {
			return rawColors[col];			
		}
	}
	
	return (<>
		<View style={[styles.subText]}>
			{
				storage?.switches?.useSemRawColors && (<>
					<FormRow
						label="Semantic & Raw Colors"
						subLabel="If you enabled [Use Semantic/Raw Color], you can pick the colors from here"
						leading={<FormRow.Icon source={getAssetIDByName("ic_audit_log_24px")} />}
						trailing={FormRow.Arrow}
						onPress={() =>
							navigation.push("VendettaCustomPage", {
								title: "Semantic & Raw Colors",
								render: () => <SemRawComponent/>,
							})
						}
					/>
				</>)
			}
			{
				customizeableColors?.map((obj) => {
					const whenPressed = () => openSheet(
						CustomColorPickerActionSheet, {
							color: colorConverter?.toInt(storage.colors[obj.id] || obj?.defaultColor || "#000"),
							onSelect: (color) => {
								const value = colorConverter?.toHex(color)
								// console.log(color, value)
								storage.colors[obj.id] = value
							}
						}
					);

					return (<>
						<FormRow
							label={obj?.label}
							subLabel={obj?.subLabel || "Click to Update"}
							onPress={whenPressed}
							trailing={
								<TouchableOpacity onPress={whenPressed}>
									<Image
										source={{ uri: transparentBase64 }}
										style={{ 
											width: 32, 
											height: 32,
											borderRadius: 10, 
											backgroundColor: storage?.colors[obj.id] || customizeableColors.find(x => x?.id == obj?.id)?.defaultColor || "#000"
										}}
									/>
								</TouchableOpacity>
							}
						/>
					</>)
				})
			}			
			<View style={styles.container}>
				<FormRow 
					style={{ justifyContent: 'center', alignItems: 'center' }} 
					label={`Preview Style: ${storage?.switches?.darkMode ? "Dark" : "Light"} Mode`}
					subLabel={`Click to Switch Mode`}
					trailing={
						<FormSwitch
							value={storage?.switches?.darkMode ?? true}
							onValueChange={ (value) => (storage.switches.darkMode = value) }
						/>
					}
				/>

				<View style={[styles.row, styles.border, {overflow: "hidden", marginRight: 10}]}>
					<View style={
						{ 
							width: "2%",
							backgroundColor: `${storage.colors.gutterColor}${parseColorPercentage(gutterAlpha)}`,
						}
					}/>
					<View style={
						{ 
							flex: 1,										
							backgroundColor: `${
								
								storage.switches.useSemRawColors ? 
									(handleSemRaw(storage?.colors?.semRawColorPrefix) || storage.colors.backgroundColor) :
									storage.colors.backgroundColor

							}${parseColorPercentage(BGAlpha)}`,
							justifyContent: 'center', 
							alignItems: 'center',
						}
					}>
						<Text style={{
								fontSize: 20, 
								color: storage?.switches?.darkMode ? "white" : "black"
							}
						}> Low Effort Normal Example Message </Text>
						<Text style={{
								fontSize: 20, 
								color: storage.colors.textColor || "#000000"
							}
						}> Low Effort Deleted Example Message </Text>									
					</View>
				</View>
				
				<FormSliderRow
					label={`Background Color Alpha: ${toPercentage(BGAlpha)}%`}
					value={BGAlpha}
					style={{ width: "90%" }}
					onValueChange={(v) => {
						setBGAlpha(Number(formatDecimal(v)))
						storage.colors.backgroundColorAlpha = alphaToHex(toPercentage(v));
					}}
				/>
				
				<FormDivider/>
				
				<FormSliderRow
					label={`Background Gutter Alpha: ${toPercentage(gutterAlpha)}%`}
					value={gutterAlpha}
					style={{ width: "90%" }}
					onValueChange={(v) => {
						setGutterAlpha(Number(formatDecimal(v)))
						storage.colors.gutterColorAlpha = alphaToHex(toPercentage(v));
					}}
				/>
			
			</View>
		</View>
	</>)
}
