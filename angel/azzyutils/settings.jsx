import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { UIElements } from "../../lib/utility";
import customTimestampSetting from "./pages/utils/customTimestampSetting";
import ReplyAlertSetting from "./pages/utils/replyAlertSetting";
import EML from "./pages/utils/eml";


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
		createList("ctime", "Custom Timestamp", "open Custom TimeStamp Settings", null, customTimestampSetting),
		createList("ralert", "Reply Alert", "open Reply Alert Settings", null, ReplyAlertSetting),
		createList("notype", "No Type", "Toggle No Typings", null, null),
		createList("quickid", "QID", "Toggle Quick ID", null, null),
		createList("noshare", "No Share", "Toggle No Share", null, null),	
		createList("eml", "EML", "Toggle Edit Message Locally", null, EML),
	]

	return (<>
		<ScrollView>
			<View style={{paddingBottom: 36}}>
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
		</ScrollView>
	</>)
}