import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { ErrorBoundary, Forms, General } from "@vendetta/ui/components";
import { numToHex, openSheet } from "../../../lib/utility";
import { NavigationNative, ReactNative, constants } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findByName, findByProps } from "@vendetta/metro";
import { semanticColors, rawColors } from "@vendetta/ui";
import PermList from "./PermList";
import { logger } from "@vendetta";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

const { ActionSheetTitleHeader, ActionSheetCloseButton } = findByProps("ActionSheetTitleHeader");
const CustomColorPickerActionSheet = findByName("CustomColorPickerActionSheet");
const LazyActionSheet = findByProps("hideActionSheet");
const useIsFocused = findByName("useIsFocused");

const transparentBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII='

export default function CreateRuleData({ data, index, notBuiltIn = true, builtInButEditAble }) {
	useProxy(storage)

	const navigation = NavigationNative.useNavigation();
	useIsFocused()

	const { Permissions } = constants;
    const unsorted_perm = Object.keys(Permissions);
    const permissionsFlags = unsorted_perm.sort()

	function createInputs(obj, title, value, placeholder, divide) {
		return (<>
			<FormInput
				title={title}
				value={obj[value]}
				placeholder={placeholder}
				onChange={(v) => obj[value] = v}
			/>
			{divide ? <FormDivider /> : undefined}
		</>)
	}

	const whenPressed_1 = () => openSheet(
		CustomColorPickerActionSheet, {
			color: (ReactNative.processColor(data?.colors?.text?.hex) || 0),
			onSelect: (color) => {
				const hex = numToHex(color)
				
				data.colors.text.hex = hex
				
				if(storage?.toggle?.debug) logger.log(data?.name, "Text Color Change", hex);
			}
		}
	);

	const whenPressed_2 = () => openSheet(
		CustomColorPickerActionSheet, {
			color: (ReactNative.processColor(data?.colors?.bg?.hex) || 0),
			onSelect: (color) => {
				const hex = numToHex(color)
				
				data.colors.bg.hex = hex

				if(storage?.toggle?.debug) logger.log(data?.name, "BG Color Change", hex);
			}
		}
	);

	const openPermissionCondition = () => {
		navigation.push("VendettaCustomPage", {
			title: `Editing Permissions Conditions`,
			render: () => <PermList permissions={permissionsFlags} data={data} />
		})
	}

	return (<>
		<ScrollView>
			<ErrorBoundary>
				<FormSection title="Tag Information">
					{ 
						notBuiltIn && !builtInButEditAble ? 
							createInputs(data, "Display Tag", "name", "Administrator", true) :
							createInputs(data, "Display Tag", "text", "Moderators", true) 
					}

					<FormRow
						label="Tag Text Color"
						subLabel="Click to Update"
						onPress={whenPressed_1}
						trailing={
							<TouchableOpacity onPress={whenPressed_1}>
								<Image
									source={{ uri: transparentBase64 }}
									style={{ 
										width: 96, 
										height: 96,
										borderRadius: 10, 
										backgroundColor: data?.colors?.text?.hex || "#FFF"
									}}
		      					/>
							</TouchableOpacity>
						}
					/>

					<FormRow
						label="Tag Background Color"
						subLabel="Click to Update"
						onPress={whenPressed_2}
						trailing={
							<TouchableOpacity onPress={whenPressed_2}>
								<Image
									source={{ uri: transparentBase64 }}
									style={{ 
										width: 96, 
										height: 96,
										borderRadius: 10, 
										backgroundColor: (
											notBuiltIn && !builtInButEditAble ? 
												(data?.colors?.bg?.hex || "#000") :
												(data?.backgroundColor)
										)
									}}
		      					/>
							</TouchableOpacity>
						}
					/>
				</FormSection>
				{
					builtInButEditAble && (<>
						<FormSection title="Edit Built-in Tag Permissions">
							<FormRow
								label="Click to edit"
								onPress={openPermissionCondition}
							/>
						</FormSection>
					</>)
				}
				{
					notBuiltIn && !builtInButEditAble && (<>
						<FormSection title="Permissions">
							<FormRow
								label="Click to setup"
								onPress={openPermissionCondition}
							/>
						</FormSection>
					</>)
				}
				{
					notBuiltIn && !builtInButEditAble && (<>
						<FormSection title="Deletion">
							<FormRow
								label="Click to Delete"
								style={{ color: rawColors.RED_400 }}
								onPress={() => {
									if(storage?.toggle?.debug) logger.log("Deletion", data);
									storage?.customTags?.splice(index, 1)
									navigation.pop()
								}}
							/>
						</FormSection>
					</>)
				}
			</ErrorBoundary>
		</ScrollView>
		</>)
}