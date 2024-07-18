import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { NavigationNative } from "@vendetta/metro/common"

import ListUsers from "../pages/listUsers"

import { Forms, General } from "@vendetta/ui/components";
const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

export default function IgnoreListComponent() {
	useProxy(storage)

	const navigation = NavigationNative.useNavigation();

	const listIgnore = () => {
		navigation.push("VendettaCustomPage", {
			title: `List of Ignored Users`,
			render: () => <ListUsers/>
		})
	}


	return (<>
		<FormRow
			label="Add User to List"
			subLabel="List of ignored users for the plugin"
			leading={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_members")} />}
			onPress={listIgnore}
			trailing={
				<TouchableOpacity onPress={listIgnore}>
					<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_add_24px")} />
				</TouchableOpacity>
			}
		/>
		<FormDivider />
	</>)
}

