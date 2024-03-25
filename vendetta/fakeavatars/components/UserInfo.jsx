import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { React } from "@vendetta/metro/common"

import { showInputAlert } from "@vendetta/ui/alerts";
import { logger, constants as vendettaConstants } from "@vendetta";
import { showToast } from "@vendetta/ui/toasts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { ErrorBoundary } from "@vendetta/ui/components";

import { passIcon } from "../settings";
import { UIElements, createInput } from "../../../lib/utility";
import { findByProps, findByStoreName } from "@vendetta/metro";

const { 
	ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated, 
	FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, 
	FormSection, FormDivider, FormInput, FormRadioRow 
} = UIElements;


const GuildStore = findByStoreName("GuildStore")
const { GuildIconSizes } = findByProps("GuildIconSizes")
const { ActionSheetTitleHeader, ActionSheetCloseButton } = findByProps("ActionSheetTitleHeader");
const LazyActionSheet = findByProps("hideActionSheet");
const ActionSheet = findByProps("ActionSheet")?.ActionSheet ?? find(m => m.render?.name === "ActionSheet");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
const Profiles = findByProps("showUserProfile");

const userInput = [
	// createInput("username", "Override target Username (N/A for now)", "default", "username"),
	createInput("avatar", "Override target Avatar", "default", "https://totally.work/image.jpg"),
];


export default function UserInfo({ data }) {
	useProxy(storage)
	const NO_SERVER_SPECIFIC_AVATAR_YET_DO_NOT_CHANGE_PLZ_MEOWWWW = false;
	
	const [guildData, setGuildData] = React.useState([]);
	const [serverAvatars, setServerAvatars] = React.useState([]);
	const { username, avatar } = data;

	if(!guildData?.length) {		
		const g = GuildStore.getGuilds();
		setGuildData(Object.values(g));
	}

	if(!serverAvatars.length && data?.serverAvatars?.length > 0) {
		setServerAvatars(data.serverAvatars);		
	}

	function CreateRow({ serverData }) {
		return (<>
			<FormRow
				label={serverData.name || "No Srver Name"}
				subLabel={serverData.id || null}
				disabled={serverAvatars.some(s => s.serverId == serverData.id)}
				leading={
					<GuildIconSizes.default
						guild={serverData}
						size="LARGE"
						animated={true}
					/>
				}
				onPress={() => {
						LazyActionSheet.hideActionSheet();
						showInputAlert({
							title: "Enter image link",
							placeholder: "can be a discord attachment CDN link",
							confirmText: "Confirm",
							confirmColor: "brand",
							cancelText: "Cancel",
							onConfirm: async function (d) {

								const url = d?.match(vendettaConstants.HTTP_REGEX_MULTI)?.[0];
								if(!url) return showToast("Invalid URL", getAssetIDByName("Small"));

								showToast("Setting up image...", getAssetIDByName("ic_clock"));

								try {

									data.serverAvatars.push({
										serverId: serverData?.id,
										serverName: serverData?.name,
										serverPfp: url,
									});
									setServerAvatars(data.serverAvatars);
									showToast(`Server custom avatar Added for ${serverData?.name}`, getAssetIDByName("Check"));
								}
								catch(p) {
									console.error(`[Fake Avatars] ImageActionSheet->serverAvatars addition error!`);
									logger.error(`ImageActionSheet->serverAvatars addition error!\n${p.stack}`);
									showToast("Failed to add server customAvatar", getAssetIDByName("Small"));
								}
							}
						});
					

				}}
			/>
		</>)
	}

	const PTM = (<>
		<ActionSheet scrollable>
			<ErrorBoundary>
				<ActionSheetTitleHeader
					title="Pick target Server"
					leading={passIcon("ic_category_16px")}
					trailing={<ActionSheetCloseButton onPress={()=> LazyActionSheet.hideActionSheet()} />}
				/>
				<BottomSheetFlatList
					style={{ flex: 1 }}
					contentContainerStyle={{ paddingBottom: 36 }}
					data={guildData}
					renderItem={({ item }) => <CreateRow serverData={item}/>}
					ItemSeparatorComponent={FormDivider}
				/>
			</ErrorBoundary>
		</ActionSheet>
	</>)

	return (<>
		<ScrollView style={{ margin: 5, paddingBottom: 24 }}>
			<ErrorBoundary>
				<FormSection title="Default Customization">
					<FormInput
						title="User ID"
						value={data?.userId}
						disabled
					/>
					<FormDivider/>
					<FormInput
						title="Username"
						value={data?.username}
						disabled
					/>
					{
						userInput?.map((item, index) => {
							return (<>
								<FormInput
									title={item?.title}
									keyboardType={item?.type}
									placeholder={item?.placeholder?.toString()}
									value={data[item?.id]}
									onChange={(val) => data[item.id] = val.toString()}
								/>
								{index != userInput.length-1 && <FormDivider/>}
							</>)
						})
					}
					<TouchableOpacity onPress={() => Profiles.showUserProfile({ userId: data?.userId })}>
						<Animated.View style={{ alignItems: "stretch" }}>
							<Image
								style={{
									width: 128,
									height: 128,
									borderRadius: 10,
									alignSelf: "center",									
								}}
								source={{
									uri: avatar || "https://cdn.discordapp.com/embed/avatars/2.png",
								}}
							/>
						</Animated.View>
					</TouchableOpacity>
				</FormSection>
			</ErrorBoundary>
		</ScrollView>
	</>)
}