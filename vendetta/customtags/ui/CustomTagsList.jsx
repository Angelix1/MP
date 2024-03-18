import { Forms, General } from "@vendetta/ui/components";

import CreateRuleData from "./CreateRuleData";
import { NavigationNative } from "@vendetta/metro/common";
import { findByName } from "@vendetta/metro";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { logger } from "@vendetta";

const useIsFocused = findByName("useIsFocused");

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

export default function CustomTagsList() {
	useProxy(storage)

	const navigation = NavigationNative.useNavigation();
	useIsFocused()
	
	const openRulePage = (target) => {
		if(target < 0) target = 0;

		if(!storage.customTags[target]) {
			storage.customTags[target] = { 
				name: '' , 
				colors: {
					text: {
						hex: '#FFF',
						int: 0
					},
					bg: {
						hex: '#000',
						int: 0
					}
				},
				permissions: [] 
			};
		}

		if(storage?.toggle?.debug) logger.log("Creation", storage?.customTags[target]);

		navigation.push("VendettaCustomPage", {
			title: `Editing Custom Tag`,
			render: () => <CreateRuleData data={storage?.customTags[target]} index={target}/>
		})
	}

	const editBuiltin = (dats, NBI, BBEA) => {
		navigation.push("VendettaCustomPage", {
			title: `Editing Built-in Tag`,
			render: () => <CreateRuleData data={dats} notBuiltIn={NBI} builtInButEditAble={BBEA}/>
		})
	}


	return (<>
		<ScrollView style={{ flex: 1 }} >
			<FormSection title="Custom Tags List">
				<FormRow
					label="Owner"
					subLabel="Built-in Tags"
					trailing={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_edit_24px")} />}
					onPress={() => editBuiltin(storage?.builtInReplace[1], false, null)}
				/>
				<FormDivider />
				{
					storage?.toggle?.useDefaultTag && storage.builtInDefault?.map((comp, i) => {
						return (<>
							<FormRow 
								label={comp?.text}
								trailing={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_edit_24px")} />}
								onPress={() => editBuiltin(comp, false, true)}
							/>
							{i !== storage.builtInDefault?.length - 1 && <FormDivider />}
						</>);
					})
				}
				{
					storage.customTags?.map((comp, i) => {
						return (<>
							<FormRow 
								label={comp?.name}
								trailing={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_edit_24px")} />}
								onPress={() => openRulePage(storage?.customTags?.findIndex(e => e?.name == comp?.name)) }
							/>
							{i !== storage.customTags?.length - 1 && <FormDivider />}
						</>);
					})
				}
				<FormRow
					label="Add New Tags"
					trailing={
						<TouchableOpacity onPress={() => openRulePage(storage?.customTags?.length)}>
							<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_add_24px")} />
						</TouchableOpacity>
					}
				/>
			</FormSection>
		</ScrollView>
	</>)
}
