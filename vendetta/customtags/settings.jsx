import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { ErrorBoundary, Forms, General } from "@vendetta/ui/components";
import { NavigationNative } from "@vendetta/metro/common";
import { findByName } from "@vendetta/metro";

import { createToggle } from "../../lib/utility";
import CustomTagsList from "./ui/CustomTagsList";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

const useIsFocused = findByName("useIsFocused");

const toggle = [
	createToggle("useRoleColor", "Use highest role color", "Use top role color as backgrounds", null, false),
	createToggle("useDefaultTag", "Use Default Tag", "Premade ADMIN, MANAGER, MOD", null, true),
	createToggle("useCustomTags", "Use custom tag", "Your own ruleset", null, false),
	createToggle("debug", "Send logs to debug log")
]


export default function Settings() {
	useProxy(storage)

	const navigation = NavigationNative.useNavigation();
	useIsFocused()


	const onPress = () => {
		navigation.push("VendettaCustomPage", {
			title: `List of Custom Tags`,
			render: () => <CustomTagsList />
		})
	};

	return (<>
		<ScrollView style={{ flex:1 }}>
			<ErrorBoundary>
				<FormSection title="Plugin Preferences">
					{
						toggle.map((item, index) => {
							return (<>
								<FormRow 
									label={item?.label}
									subLabel={item?.subLabel}
									leading={item?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(item?.icon)} />}
									trailing={
										<FormSwitch
											value={storage?.toggle[item?.id] || false}
											onValueChange={ (value) => (storage.toggle[item.id] = value) }
										/>
									}
								/>
								{index == toggle?.length - 1 ? undefined : <FormDivider/> }
							</>)
						})
					}
				</FormSection>
				<FormSection title="Custom Tag">
					<FormRow
						label="View List"
						subLabel="Click to open list of custom tags rule you made"
						onPress={onPress}
						trailing={
							<TouchableOpacity onPress={onPress}>
								<FormArrow />
							</TouchableOpacity>
						}
					/>					
				</FormSection>
			</ErrorBoundary>
		</ScrollView>
	</>)
}