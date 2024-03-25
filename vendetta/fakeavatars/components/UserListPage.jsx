import { NavigationNative, React, ReactNative, constants, navigation } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { findByName, findByProps } from "@vendetta/metro";

import UserInfo from "./UserInfo";
import { UIE } from "../lib/lib";
import { passIcon } from "../settings";
import { showToast } from "@vendetta/ui/toasts";
import { styles } from "../css";
import { semanticColors } from "@vendetta/ui";
import { UIElements } from "../../../lib/utility";

const { 
	ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated, 
	FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, 
	FormSection, FormDivider, FormInput, FormRadioRow 
} = UIElements;

const useIsFocused = findByName("useIsFocused");
const { getUser } = findByProps('getUser');


export default function UserListPage() {
	useProxy(storage)

	const [newUser, setNewUser] = React.useState("")

	const navigation = NavigationNative.useNavigation();
	useIsFocused()

	const openDetailedData = (userData) => {
		navigation.push("VendettaCustomPage", {
			title: `${userData?.username || "User"} Information`,
			render: () => <UserInfo data={userData} />
		})
	}

	const addNewUser = () => {
		if(newUser) {
			if(!isNaN(parseInt(newUser))) {
				if(!storage?.users[newUser]) {
	                let validUser = getUser(newUser);
	                if(validUser) {
	                    storage.users[`${validUser.id}`] = {
							userId: validUser.id,
							username: validUser?.username,
							avatar: validUser?.getAvatarURL?.()?.replace?.("webp", "png") || null, 
							serverAvatars: []
						}
						openDetailedData(storage.users[validUser.id])
	                } 
	                else {
            			setNewUser("")
	                    return showToast('Invalid User Id');
	                }
				} 
				else {
					showToast('User already existed on the list');
				}
            }
            setNewUser("")
		}
	}

	return (<>
		<FormSection title="User List">	
			<View style={[ styles.i_like_dark ]}>
				<FormRow
					label={
						<FormInput
							value={newUser}
							onChangeText={setNewUser}
							placeholder="User ID"
							onSubmitEditing={addNewUser}
						/>
					}
					trailing={passIcon("ic_add_24px")}
					onPress={addNewUser}
				/>
				<FormDivider/>
				{
					(Object.keys(storage?.users).length > 0) && 
					Object.entries(storage?.users).map(([userId, data], inx) => {
						return (<>
							<FormRow
								label={data?.username || "Couldn't find Username"}
								subLabel={userId}
								trailing={
									<TouchableOpacity onPress={() => {
										showToast(`${data.username} is deleted.`)
										delete storage.users[userId];
										// console.log(storage.users)
									}}>
										{passIcon("trash")}
									</TouchableOpacity>
								}
								onPress={() => {
									openDetailedData(data)
								}}
							/>
							{ inx == Object.keys(storage?.users)?.length+1 ? undefined : <FormDivider/> }
						</>)
					})
				}
			</View>
		</FormSection>
	</>)
}