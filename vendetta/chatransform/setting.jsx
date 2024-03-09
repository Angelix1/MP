import * as util from "../../lib/utility";

import { ReactNative } from "@vendetta/metro/common";
import { General, Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { find, findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormSliderRow } = Forms;

function createInput(id, title, type, placeholder) {
	return { id, title, type,  placeholder }
}
const textInputs = [
	createInput("imageURL", "URL for the avatars (Leave Empty to Disable)", "default", "https://cdn.discordapp.com/attachments/919655852724604978/1197224092554772622/9k.png"),
	createInput("username", "The usernames (Leave Empty to Disable)", "default", "Wario"),
	createInput("tagText", "The Tag text (Leave Empty to Disable)", "default", "WARIO"),
]
export default () => {
	useProxy(storage);
		
	return (
		<ScrollView>
			<FormSection title="Plugin Setting">
				{ 
					textInputs?.map((obj, index) => {
						return (<>
							<FormInput
								title={obj?.title}
								keyboardType={obj?.type}
								placeholder={obj?.placeholder?.toString()}
								value={storage?.[obj.id] ?? obj?.placeholder}
								onChange={(val) => (storage[obj.id] = val.toString())}
							/>
							
							{index !== textInputs.length - 1 && <FormDivider />}
						</>)
					})
				}
			</FormSection>
		</ScrollView>
	);
};