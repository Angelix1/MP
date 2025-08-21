import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { findByName } from "@vendetta/metro";

import { CustomMentionsSetting, ReplyAlertSetting } from "./pages/utils/replyAlertSetting";
import NoShareSetting from "./pages/utils/NoShareSetting";
import CAT from "./pages/utils/cat";
import QuickIdSetting from "./pages/utils/quickIdSetting";
import CustomUsernameColorPage from "./pages/utils/cuc";
import CustomRoleIconPage from "./pages/utils/cri";
import CustomClanBadge from "./pages/utils/ct";
import { Forms, General } from "@vendetta/ui/components";

// const HelpMessage = findByName("HelpMessage");

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated, Component } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

export default () => {
	useProxy(storage)

	const createList = (id, title, label, subLabel, props) => { 
		return { 
			id, 
			title, 
			label, 
			subLabel, 
			props,
		}
	}


	const PageChildren = [
		createList("cactus", "Cactus", "Toggle uhhh.. something", null, CAT),
		createList("notype", "No Type", "Toggle No Typings", null, null),
		createList("quickid", "QID", "Toggle Quick ID Setting", null, QuickIdSetting),
		createList("noshare", "No Share", "Toggle No Share", null, NoShareSetting),
		createList("customUsernameColor", "CUC", "Toggle Custom Username Color", null, CustomUsernameColorPage),
		createList("customRoleIcon", "CRI", "Toggle Custom Role Icon", null, CustomRoleIconPage),
		createList("customClan", "CCB", "Toggle Custom Clan Badge", null, CustomClanBadge),
		createList("ralert", "Reply Alert", "Toggle Settings", null, ReplyAlertSetting),
		createList("customMention", "Custom Mentions", "Toggle Custom Mentions Settings", null, CustomMentionsSetting),
		createList("removeDecor", "I HATE AVATAR DECORATIONS", "Toggle Remove Avatar Decoration", null, null),
	]

	return (<>
		<ScrollView>
			<View style={{				
				borderRadius: 10, 
				backgroundColor: "rgba(0, 12, 46, 0.15)",
				marginBottom: 50,
				marginTop: 20
			}}>
			{/*{<HelpMessage messageType={0}>"To use a feature, please enable them and their respective setting open."</HelpMessage>}*/}
			<FormRow
				label="Debug"
				subLabel="enable console logging"
				trailing={
					<FormSwitch
						value={storage.debug}
						onValueChange={(value) => {
							storage.debug = value
						}}
					/>
				}
			/>
			<FormDivider/>
			{
				PageChildren.map((element, i) => {				
					return (<>
						<FormSection title={element?.title}>
							<FormRow
								label={element?.label}
								subLabel={element?.subLabel}
								trailing={
									<FormSwitch
										value={storage.toggle[element?.id]}
										onValueChange={(value) => {
											storage.toggle[element?.id] = value
										}}
									/>
								}
							/>
							{
								storage.toggle[element.id] && 
								element.props && (
									<View style={{ 
										margin: 5, 
										padding: 10, 
										borderRadius: 10, 
										backgroundColor: "rgba(0, 0, 0, 0.15)"
									}}>
										<element.props />
									</View>
								)
							}
						</FormSection>
					</>)
				})
			}
			</View>
			<FormDivider />
		</ScrollView>
	</>)
}