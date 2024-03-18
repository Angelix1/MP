import { findByName } from "@vendetta/metro";
import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import SpecificPerm from "./SpecificPerm";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

const useIsFocused = findByName("useIsFocused");

export default function PermList({ permissions, data }) {
	useProxy(storage)

	return (<>
		<ScrollView>
			<FormSection title="Permissions List">
				<View style={{ margin: 5, padding: 10 }}>
					{
						permissions.map((perm, i) => {
							return <SpecificPerm data={data} perm={perm} />
						})
					}
				</View>
			</FormSection>
		</ScrollView>
	</>)
}