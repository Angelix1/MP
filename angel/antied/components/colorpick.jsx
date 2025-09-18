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

const { alphaToHex, hexAlphaToPercent } = convert;

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

	const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

	const [BGAlpha, setBGAlpha] = React.useState(
		clamp((hexAlphaToPercent(storage?.colors?.backgroundColorAlpha) ?? 100), 0, 100)
	)
	const [gutterAlpha, setGutterAlpha] = React.useState(
		clamp((hexAlphaToPercent(storage?.colors?.gutterColorAlpha) ?? 100), 0, 100)
	)

	const [useText, setUseText] = React.useState(false);

	const navigation = NavigationNative.useNavigation();

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
							backgroundColor: `${storage.colors.gutterColor}${storage.colors.gutterColorAlpha}`,
						}
					}/>

					{
						// console.log(`${storage.colors.gutterColor}  ${storage.colors.gutterColor}`)
					}
					{
						// console.log(`${storage.switches.useSemRawColors ? (handleSemRaw(storage?.colors?.semRawColorPrefix) || storage.colors.backgroundColor) : storage.colors.backgroundColor}${storage.colors.backgroundColorAlpha}`)
					}
					
					<View style={
						{ 
							flex: 1,										
							backgroundColor: `${
								storage.switches.useSemRawColors ? 
									(handleSemRaw(storage?.colors?.semRawColorPrefix) || storage.colors.backgroundColor) :
									storage.colors.backgroundColor
							}${storage.colors.backgroundColorAlpha}`,
							justifyContent: 'center', 
							alignItems: 'center',
						}
					}>
						<Text style={{
								fontSize: 20, 
								color: storage?.switches?.darkMode ? "black" : "white"
							}
						}> Low Effort Normal Example Message </Text>
						<Text style={{
								fontSize: 20, 
								color: storage.colors.textColor || "#000000"
							}
						}> Low Effort Deleted Example Message </Text>									
					</View>
				</View>
				
				<FormRow
					label="Click to switch input type"
					subLabel="Switch from slider to number and vise versa"
					onPress={() => {
						setUseText(!useText)
					}}
				/>

				{
					useText ? (<>
							<FormInput
								title={`Background Color Alpha: ${BGAlpha}%`}
								keyboardType="numeric"
								style={{ width: "90%" }}
								value={`${BGAlpha}`}
								onChange={(val) => {
									val = clamp(val, 0, 100)

									setBGAlpha(Number(val))
									storage.colors.backgroundColorAlpha = alphaToHex(val);
								}}
							/>
						</>) : (<>
							<FormSliderRow
								label={`Background Color Alpha: ${BGAlpha}%`}
								value={BGAlpha}
								minVal={0}
								maxVal={100}
								style={{ width: "90%" }}
								onValueChange={(v) => {
									setBGAlpha(Number(v))
									storage.colors.backgroundColorAlpha = alphaToHex(v);
								}}
							/>
						</>)
				}
				
				<FormDivider/>

				{
					useText ? (<>
							<FormInput
								title={`Background Gutter Alpha: ${gutterAlpha}%`}
								keyboardType="numeric"
								style={{ width: "90%" }}
								value={`${gutterAlpha}`}
								onChange={(val) => {
									val = clamp(val, 0, 100)

									setGutterAlpha(Number(val))
									storage.colors.gutterColorAlpha = alphaToHex(val);
								}}
							/>
						</>) : (<>
							<FormSliderRow
								label={`Background Gutter Alpha: ${gutterAlpha}%`}
								value={gutterAlpha}
								minVal={0}
								maxVal={100}
								style={{ width: "90%" }}
								onValueChange={(v) => {
									setGutterAlpha(Number(v))
									storage.colors.gutterColorAlpha = alphaToHex(v);
								}}
							/>
						</>)
				}
			
			</View>
		</View>
	</>)
}
