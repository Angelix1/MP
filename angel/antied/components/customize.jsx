import { storage } from "@vendetta/plugin"
import { getAssetIDByName } from "@vendetta/ui/assets"
import { useProxy } from "@vendetta/storage"

import { findByName } from "@vendetta/metro"

import { Forms, General } from "@vendetta/ui/components";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Pressable, Image, Animated } = General;
const { FormRow, FormIcon, FormSwitch, FormDivider } = Forms
const HelpMessage = findByName("HelpMessage");

const customizeableSwitches = [
	{
		id: "minimalistic",
		default: true,
		label: "Minimalistic Settings",
		subLabel: "Removes all Styling (Enabled by Default)",
	},
	{
		id: "useBackgroundColor",
		default: false,
		label: "Enable Background Color",
		subLabel: "Background Color for Deleted Message, similiar to Mention but Customizeable",
	},
	{
		id: "useSemRawColors",
		default: false,
		label: "Use Semantic/Raw Color",
		subLabel: "Use Semantic/Raw Color instead of Custom Color for Background Color, doesn't applied to GutterColor",
	},
	{
		id: "ignoreBots",
		default: false,
		label: "Ignore Bots",
		subLabel: "Ignore bot deleted messages.",
	},
	{
		id: "removeDismissButton",
		default: false,
		label: "Remove Dissmiss Message",
		subLabel: "Remove clickable Dismiss Message text from deleted ephemeral messages.",
	},
	{
		id: "addTimestampForEdits",
		default: false,
		label: "Add Edit Timestamp",
		subLabel: "Add Timestamp for edited messages.",
	},
	{
		id: "useEphemeralForDeleted",
		default: true,
		label: "Use Ephemeral for Deleted",
		subLabel: "When messages got deleted it'll use ephemeral instead of normal message (Enabled by Default).",
	}
]

export default function CustomizationComponent({ styles }) {
	useProxy(storage)
	
	return (<>
		<View style={[styles.subText]}>		
		{
			storage?.switches.minimalistic && (
				<HelpMessage messageType={0}>To use styling, disable "Minimalistic" option</HelpMessage>
			)
		}
		{
			customizeableSwitches?.map((obj, index) => {
				return (<>
					<FormRow 
						label={obj?.label}
						subLabel={obj?.subLabel}
						leading={obj?.icon && <FormIcon style={{ opacity: 1 }} source={getAssetIDByName(obj?.icon)} />}
						trailing={
							("id" in obj) ? (
								<FormSwitch
								value={storage?.switches[obj?.id] ?? obj?.default}
								onValueChange={ (value) => (storage.switches[obj?.id] = value) }
								/>
							) : undefined
						}
					/>
					{index !== customizeableSwitches?.length - 1 && <FormDivider />}
				</>)
			})
		}
		</View>
	</>)
}
