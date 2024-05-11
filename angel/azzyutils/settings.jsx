import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { UIElements } from "../../lib/utility";
import ReplyAlertSetting from "./pages/utils/replyAlertSetting";
import EML from "./pages/utils/eml";
import updates from "./update";
import VersionChange from "../../lib/components/versionChange";
import NoShareSetting from "./pages/utils/NoShareSetting";
import CAT from "./pages/utils/cat";
import QuickIdSetting from "./pages/utils/quickIdSetting";
import { findByName } from "@vendetta/metro";

// const HelpMessage = findByName("HelpMessage");

const { 
	ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated, 
	FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, 
	FormSection, FormDivider, FormInput, FormRadioRow, Component
} = UIElements;

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
		createList("eml", "EML", "Toggle Edit Message Locally", null, EML),
		createList("notype", "No Type", "Toggle No Typings", null, null),
		createList("quickid", "QID", "Toggle Quick ID Setting", null, QuickIdSetting),
		createList("noshare", "No Share", "Toggle No Share", null, NoShareSetting),	
		createList("ralert", "Reply Alert & Custom Mentions", "Toggle Reply Alert & Custom Mentions Settings", null, ReplyAlertSetting),
		createList("removeDecor", "I HATE AVATAR DECORATIONS", "Toggle Remove Avatar Decoration", null, null),
	]

	return (<>
		<ScrollView>
			<View style={{
				paddingBottom: 36,
				borderRadius: 10, 
				backgroundColor: "rgba(0, 12, 46, 0.15)"
			}}>
			{/*<HelpMessage messageType={0}>"This Plugin development is moved to new Repository"</HelpMessage>*/}
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
			{
				updates && (
					<FormSection title="Updates">
						<View style={{ 
							margin: 5, 
							padding: 5,
							borderRadius: 10,
							backgroundColor: "rgba(59, 30, 55, 0.15)"
						}}>
							{
								updates.map((data, index) => {
									return <VersionChange change={data} index={index} totalIndex={updates.length}/>
								})
							}
						</View>
					</FormSection>
				)
			}
		</ScrollView>
	</>)
}