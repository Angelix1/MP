import { storage } from "@vendetta/plugin";
import { ReactNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

import updates from "./update";
import VersionChange from "../../lib/components/versionChange";

function createToggle(id, label, subLabel = null, icon = null, def = false) {
	return { id, label, subLabel, icon, def }
}

const toggles = [
	createToggle(
		"removeTracking", 
		"Remove Telementry", 
		"Remove additional telemetry from url or site tracking"		
	),
	createToggle(
		"encodeURL",
		"Encode Parsed URL",
		"encodeURL Before sending to RIS APIs"
	)
]

export default () => {
	useProxy(storage);

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
			<FormSection>
				{
					toggles.map((elem, indx) => {
						return (<>
							<FormRow 
								label={elem?.label}
								subLabel={elem?.subLabel}
								leading={elem?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(elem?.icon)} />}
								trailing={
									<FormSwitch
										value={storage?.toggle[elem?.id] || false}
										onValueChange={ (value) => (storage.toggle[elem.id] = value) }
									/>
								}
							/>
							{indx == toggles?.length - 1 ? undefined : <FormDivider/> }
						</>)
					})
				}
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
			{
				updates && (
					<FormSection title="Updates">
						<View style={{ 
							margin: 5, 
							padding: 5,
							borderRadius: 10,
							backgroundColor: "rgba(0, 0, 0, 0.3)"
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
	);
}