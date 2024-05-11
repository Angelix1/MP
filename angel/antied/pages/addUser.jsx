import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { NavigationNative, clipboard, constants, React, stylesheet, ReactNative as RN } from "@vendetta/metro/common";
import { findByProps, findByPropsAll, findByStoreName, findByName, findByTypeName } from '@vendetta/metro';
import { semanticColors, rawColors } from "@vendetta/ui";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;
// find stuff
const useIsFocused = findByName("useIsFocused");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
const UserStore = findByStoreName("UserStore");
const Profiles = findByProps("showUserProfile");

// Icons idk
const Add = getAssetIDByName("ic_add_24px");
const Mod = getAssetIDByName("ic_arrow");
const Remove = getAssetIDByName("ic_minus_circle_24px");
const Checkmark = getAssetIDByName("Check");
const Crossmark = getAssetIDByName("Small");

function addIcon(i) {
	return <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(i)} />
}


const styles = stylesheet.createThemedStyleSheet({
	basicPad: {
		paddingRight: 10,
		marginBottom: 10,
		letterSpacing: 0.25,        
	},
	header: {
		color: semanticColors.HEADER_PRIMARY,
		fontFamily: constants.Fonts.DISPLAY_BOLD,
		fontSize: 25,
		paddingLeft: "3%",
		letterSpacing: 0.25
	},
	sub: {
		color: semanticColors.TEXT_POSITIVE,
		fontFamily: constants.Fonts.DISPLAY_NORMAL,
		paddingLeft: "4%",
		fontSize: 18  
	},
	flagsText: {
		color: semanticColors.HEADER_SECONDARY,
		fontFamily: constants.Fonts.PRIMARY_BOLD,
		paddingLeft: "4%",
		fontSize: 16
	},
	container: {
		marginTop: 25,
		marginLeft: '5%',
		marginBottom: -15,
		flexDirection: "row"
	},
	textContainer: {
		paddingLeft: 15,
		paddingTop: 5,
		flexDirection: 'column',
		flexWrap: 'wrap',
		shadowColor: "#000",
		shadowOffset: {
			width: 1,
			height: 4,
		},
		shadowOpacity: 0.20,
		shadowRadius: 4.65,
		elevation: 8
	},
	image: {
		width: 75,
		height: 75,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 1,
			height: 4,
		},
		shadowOpacity: 0.20,
		shadowRadius: 4.65,
		elevation: 8
	},
	mainText: {
		opacity: 0.975,
		letterSpacing: 0.25
	},
	subHeader: {
		color: semanticColors.HEADER_SECONDARY,
		fontSize: 12.75,
	}
});


const placeholder = 'Missing_No';

export default function AddUser({ index }) {

	// let [btn, setBtn] = React.useState(false)

	useProxy(storage);
	let object = storage?.inputs?.ignoredUserList[index];

	const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

	const onPressIn = () => Animated.spring(animatedButtonScale, { toValue: 1.1, duration: 10, useNativeDriver: true }).start();

	const onPressOut = () => Animated.spring(animatedButtonScale, { toValue: 1, duration: 250, useNativeDriver: true }).start();
	
	const animatedScaleStyle = {
		transform: [
			{
				scale: animatedButtonScale
			}
		]
	};

	let user = UserStore.getUser(object?.id);
	let cached = Object.values(UserStore.getUsers());

	if(!user) user = cached.find(u => u?.username == object?.username);
	if(!user) user = cached.find(u => u?.username?.toLowerCase() == object?.username?.toLowerCase());

	const navigation = NavigationNative.useNavigation();
	useIsFocused();

	return (<>
		<ScrollView>
			<View style={[styles.basicPad, styles.sub]}>
				<FormSection title="User Setting" style={[styles.header]}>
					<FormRow
						label="Find User Id or Username"
						leading={addIcon('ic_search')}
						onPress={() => {
							if(user && !object.username?.length) {
								object.username = user.username;
							}
							else if(user && !object.id?.length) {
								object.id = user.id;
							} 
							else {
								showToast('Cannot find User Id/Username.')
							}
						}}
					/>
					<FormInput
						title="User Username | Case Sensitive"
						placeholder="Missing No"
						value={object?.username}
						onChange={(v) => object.username = v}
					/>
					<FormInput
						title="User Id"
						placeholder="Missing No"
						value={object?.id}
						onChange={(v) => object.id = v}
					/>
					<FormRow 
						label='User is webhook?'
						subLabel='User is webhook or system, and not BOT or Normal User.'
						leading={addIcon('ic_webhook_24px')}
						trailing={
							<FormSwitch
								value={object?.isWebhook || false}
								onValueChange={ (value) => object.isWebhook = value }
						/>
						}
					/>
				</FormSection>
				{ user &&(
					<View style={[styles.container, { paddingBottom: 10 }]}>
						<TouchableOpacity 
							onPress={() => Profiles.showUserProfile?.({ userId: user?.id })}
							onPressIn={onPressIn}
							onPressOut={onPressOut}
							>
							<Animated.View style={animatedScaleStyle}>
								<Image
									source={
										{ 
											uri: (
												user?.getAvatarURL?.()?.replace?.("webp", "png") || 
												"https://cdn.discordapp.com/embed/avatars/2.png"
											) 
										}
									}
									style={{ 
										width: 128, 
										height: 128,
										borderRadius: 10,
									}}
								/>                                
							</Animated.View>
						</TouchableOpacity>
						
						<View style={styles.textContainer}>
							<TouchableOpacity onPress={() => Profiles.showUserProfile({ userId: user?.id })}>
								<Text style={[styles.mainText, styles.header]}>{ user?.username || object?.username || 'No Name' }</Text>
							</TouchableOpacity>
						</View>
						<FormDivider />
					</View>
				)}
				<FormRow 
					label={<FormLabel text="Remove User from Ignore List" style={{ color: rawColors.RED_400 }}/> } 
					onPress={() => {
						navigation.pop()
						storage?.inputs?.ignoredUserList?.splice(index, 1);
					}
				}/>
			</View>
		</ScrollView>
	</>)
}

