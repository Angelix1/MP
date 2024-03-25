import { NavigationNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { ErrorBoundary } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

import { UIElements } from "../../lib/utility";
import UserListPage from "./components/UserListPage";
import { useProxy } from "@vendetta/storage";

const { 
	ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated,
	FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, 
	FormSection, FormDivider, FormInput, FormRadioRow
} = UIElements;


export const passIcon = (name) => <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(name)} />;

export default () => {
	useProxy(storage)
	const navigation = NavigationNative.useNavigation();

	const openUserListPage = () => {
		navigation.push("VendettaCustomPage", {
			title: `Users List`,
			render: () => <UserListPage />			
		});
	}

	return (<>
		<ScrollView>
			<ErrorBoundary>
				<FormSection title="Users List">
					<FormRow
						label="Click to View Users List"
						subLabel="All saved users data"
						leading={passIcon("ic_members")}
						trailing={passIcon("ic_arrow")}
						onPress={openUserListPage}
					/>
				</FormSection>
			</ErrorBoundary>
		</ScrollView>
	</>)
}	