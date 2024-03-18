import { storage } from "@vendetta/plugin";
import { ReactNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";


const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;


export default () => {
	useProxy(storage);

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
			<FormSection>
				<FormRow 
					label="Remove Telementry"
					subLabel="Remove additional Telementry from url and site tracking"
					trailing={
						<FormSwitch
							value={storage?.toggle?.removeTracking || false}
							onValueChange={ (value) => (storage.toggle.removeTracking = value) }
						/>
					}
				/>
			</FormSection>
			<FormSection title="Services">
				<ReactNative.FlatList
					data={Object.entries(storage.services)}
					ItemSeparatorComponent={FormDivider}
					renderItem={({ item: [id, item] }) => (
						<FormRadioRow
							label={item.name}
							selected={item.enabled}
							onPress={() => (item.enabled = !item.enabled)}
			            />
					)}
				/>				
			</FormSection>
		</ScrollView>
	);
}