/* i've suffered immense brain damage */

import { Forms, General } from "@vendetta/ui/components";
import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { NavigationNative, clipboard, constants, React, stylesheet, ReactNative } from "@vendetta/metro/common";
import { semanticColors, rawColors } from "@vendetta/ui";
import { showToast } from "@vendetta/ui/toasts";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";

const dialog = findByProps("show", "confirm", "close");
const Search = findByName("StaticSearchBarContainer");
const UserStore = findByStoreName("UserStore");
const Profiles = findByProps("showUserProfile");
const useIsFocused = findByName("useIsFocused");
const { openURL } = findByProps("openURL", "openDeeplink");

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

const { FlatList } = ReactNative;

const styles = stylesheet.createThemedStyleSheet({
	main_text: {
		opacity: 0.975,
		letterSpacing: 0.25,
		fontFamily: constants.Fonts.DISPLAY_NORMAL,
	},
	item_container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 4,
		paddingBottom: 4,
		width: "100%",
	},
	log_header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		maxWidth: "95%",
	},
	log_sub_header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		maxWidth: "50%",
	},
	log_time: {
		color: semanticColors.TEXT_MUTED,
		opacity: 0.990,
		fontSize: 13,
		paddingLeft: 4,
	},
	log_type: {
		color: semanticColors.TEXT_MUTED,
		opacity: 0.450,
		fontSize: 16,
		marginLeft: "auto",
	},
	avatar_container: {
		alignSelf: "start",
		justifySelf: "start",
		marginTop: 5
	},
	author_avatar: {
		width: 40,
		height: 40,
		borderRadius: 80,
	},
	author_name: {
		color: semanticColors.HEADER_PRIMARY,
		fontFamily: constants.Fonts.DISPLAY_BOLD,
		fontSize: 14,
		letterSpacing: 0.25,
		paddingBottom: 4,
	},
	old_message: {
		color: semanticColors.TEXT_MUTED,
		opacity: 0.890,
		fontSize: 13,
	},
	message_content: {
		color: semanticColors.TEXT_NORMAL,
		opacity: 0.985,
		fontSize: 13,
	},
	main_container: {
		paddingLeft: 8,
		paddingRight: 4,
		paddingTop: 2,
		paddingBottom: 16,
		width: "95%",
	},
	text_container: {
		display: "flex",
		flexDirection: "column",
		paddingBottom: 4,
		paddingLeft: 8,
		width: "95%",
	},
});


function shortenString(str, maxLength) {
	if(str?.length > maxLength) {
		return str?.substring(0, maxLength) + "...";
	}
	return str;
}

export default () => {    
	useProxy(storage);
	
	useIsFocused();

	const animatedButtonScale = React.useRef(new Animated.Value(1)).current;

	const onPressIn = () => Animated.spring(animatedButtonScale, { 
		toValue: 1.1, duration: 10, useNativeDriver: true 
	}).start();

	const onPressOut = () => Animated.spring(animatedButtonScale, { 
		toValue: 1, duration: 250, useNativeDriver: true 
	}).start();

	const animatedScaleStyle = {
		transform: [
			{
				scale: animatedButtonScale
			}
		]
	};


	// const log = storage?.log?.reverse() || [];
	const [log, setLog] = React.useState([])

	React.useEffect(() => {
		if(storage?.log?.length > 0) {
			setLog(storage.log.reverse())
		}
	}, [])

	if((log?.length > storage?.inputs?.logCount) && storage.logWarning) {
		dialog.show({
			title: "Log exceed limit",
			body: "Clear log?",
			confirmText: "Yes",
			cancelText: "NO",
			confirmColor: "brand",
			onConfirm: () => {
				storage.log = [];
				setLog([])
				showToast("[ANTIED] Cleared the log")
			}
		})
	}
	
	const snipLength = Number(storage?.inputs?.logLength || 60);

	function MessageThing({ data }) {
		const { type, author, content, edited, where } = data;

		return (<>
			<View style={styles.item_container}>
				<TouchableOpacity 
					style={styles.avatar_container}
					onPress={() => Profiles.showUserProfile({ userId: author["id"] }) } 
					onPressIn={onPressIn}
					onPressOut={onPressOut}
				>
					<Animated.View style={[animatedScaleStyle]}>
						<Image
							source={{ 
								uri: (
									(author.avatar) ?
										`https://cdn.discordapp.com/avatars/${author?.id}/${author.avatar}.png` :
										"https://cdn.discordapp.com/embed/avatars/2.png"
								)
							}}
							style={styles.author_avatar}
						/>
					</Animated.View>
				</TouchableOpacity>

				<View style={styles.text_container}> 
					<View style={styles.log_header}>
						<View style={styles.log_sub_header}>
							<Text style={[styles.main_text, styles.author_name]}>
								{
									`${author["username"]}`
								}
							</Text>
							{
								<View style={{ paddingLeft: "2px" }}>{
									((type == "MessageUpdate") ? 
										<FormRow.Icon source={getAssetIDByName("pencil")} /> : 
										<FormRow.Icon source={getAssetIDByName("ic_message_delete")} />
									)									
								}</View>
							}
							<TouchableOpacity 
								onPress={() => {
									if(
										type == "MessageUpdate" && 
										data.where.guild && 
										data.where.channel && 
										data.where.messageLink
									) {
										openURL(`https://discord.com/channels/${data.where.guild}/${data.where.channel}/${data.where.messageLink}`)
									} 
									else {
										showToast("Cannot find target Message")
									}
								}}
							>
								<View style={{paddingLeft: "2px" }}>
									<FormRow.Icon
										source={getAssetIDByName("ic_show_media")}
									/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity 
						onPress={() => { 
							let clip = author.username;
							clip += ` (${author.id}):\n`;
							clip += `>>> ${content}`;
							if(edited) {
								clip += `\n\n${edited}`
							}
							
							clipboard.setString(clip);
							showToast("Log content copied") 
						}} 
						style={styles.text_container}
					>
						<View>
						{
							(edited?.length > 0) ? (<>
								<Text style={[styles.main_text, styles.old_message]}>
									{shortenString(content, snipLength)}
								</Text>
								<Text style={[styles.main_text, styles.message_content]}>
									{shortenString(edited, snipLength)}
								</Text>
							</>) : 
							(
								<Text style={styles.message_content}>
									{shortenString(content, snipLength)}
								</Text>
							)
						}
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</>)
	}

	return (<>
		<ScrollView>
			{
				(!storage?.switches?.enableLogging) && (<>
					<FormRow label="To save log of edited/deleted messages, go to plugin setting > patches > Toggle Antied Logging"/>
				</>)
			}
			{				
				(log?.length > 0) ? (<>
					<FormRow
						label="Nuke logs"
						trailing={<FormRow.Icon source={getAssetIDByName("ic_trash_24px")} />}
						onPress={() => {
							dialog.show({
								title: "Nuke logs",
								body: "Nuke the Log?",
								confirmText: "Yash",
								cancelText: "nu uh",
								confirmColor: "brand",
								onConfirm: () => {
									storage.log = [];
									setLog([])
									showToast("[ANTIED] Logs cleared")
								}
							})
						}}
					/>
				</>) : (<>
					<FormRow label="Only us chicken here, go touch some grass"/>
				</>)
			}
			{
				(log.length > 0) && (<>
					<View style={styles.main_container}>
						<FlatList
							style={{ paddingHorizontal: 10, paddingTop: 10 }}
							contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 5 }}
							data={log}
							renderItem={({ item }) => <MessageThing data={item} />}
						/>
					</View>
				</>)
			}
		</ScrollView>
	</>)
};