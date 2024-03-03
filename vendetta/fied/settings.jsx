import { find, findByProps, findByStoreName, findByName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { ErrorBoundary, Forms, General } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { NavigationNative } from "@vendetta/metro/common";

const { ActionSheetTitleHeader, ActionSheetCloseButton } = findByProps("ActionSheetTitleHeader");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
const LazyActionSheet = findByProps("hideActionSheet");
const ActionSheet = findByProps("ActionSheet")?.ActionSheet ?? find(m => m.render?.name === "ActionSheet");
const useIsFocused = findByName("useIsFocused");

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

function createDT(id, label, subLabel) {
	return { id, label, subLabel }
}

const dataTypes = [
	createDT("emoji", "Emojify your messages", "Replace punctuations with random emoji"),
	createDT("leet", "Speak Leet", "Speak like Leet"),
	createDT("spongebob", "SPonGeBoB MocK", "Mockeryyyy"),
	createDT("uwu", "UwUify your messages", "UvU"),
	createDT("zalgo", "Zalgofied your messages", "Self-explanatory"),
	createDT("unset", "Disable", null),
]

const NameTypes = {
	emoji: "Emojify",
	leet: "LEET Speak",
	spongebob: "Mocking SpongeBob Speak",
	uwu: "UwUify",
	zalgo: "Zalgofy",
	unset: "Disabled"
}


export default () => {
	useProxy(storage)
	useIsFocused();

	function CreateRow({ data }) {
		return (<>
			<FormRow
		        label={data?.label || "Placeholder Title"}
		        subLabel={data?.subLabel || null}
		        disabled={(data?.id == storage?.type) || false}
		        onPress={(ctx) => {
		        	if(data?.id == "unset") {
		        		storage.type = null
		        	} 
		        	else {
		        		storage.type = data.id
		        	}
		        	LazyActionSheet.hideActionSheet()
		        }}
		    />
		</>)
	}

	const BFM = (<> 
		<ActionSheet scrollable>
            <ErrorBoundary>
				<ActionSheetTitleHeader
					title="Changing Modification Types"
					leading={
						<FormIcon 
							style={{ opacity: 1 }} 
							source={getAssetIDByName("ic_category_16px")}
							disableColor
						/>
					}
					trailing={
						<ActionSheetCloseButton
							onPress={() => LazyActionSheet.hideActionSheet()}
						/>
					}
				/>
				<BottomSheetFlatList
					style={{ flex: 1 }}
					contentContainerStyle={{ paddingBottom: 24 }}
					data={dataTypes}
					renderItem={({ item }) => <CreateRow data={item} />}
					ItemSeparatorComponent={FormDivider}
					keyExtractor={x => x.id}
				/>
            </ErrorBoundary>
        </ActionSheet>
	</>)

	const openMT = () => {
		LazyActionSheet.openLazy(
			Promise.resolve({ default: () => BFM }), 
			"show"
		);
	}

	return (<>
		<ScrollView>
			<FormSection title="Plugin Settings">
				<FormRow
					label={`Type: ${
						storage?.type ? 
							NameTypes[storage?.type] ? 
								NameTypes[storage?.type] : 
							storage?.type : 
						"Disabled" 
					}`}
					subLabel="Modify how the messages changes"
					onPress={openMT}
					trailing={
						<TouchableOpacity onPress={openMT}>
							<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_add_24px")} />
						</TouchableOpacity>
					}
				/>
				<FormDivider />
			</FormSection>
		</ScrollView>
	</>);
}