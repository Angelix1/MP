import { NavigationNative, React, ReactNative as RN } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { findByProps, findByName } from "@vendetta/metro";
import { after, before } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";

import { makeDefaults } from "../../lib/utility";
import SettingPage from "./Setting";
import FuzzySearchPage from "./components/FuzzySearchPage";


const { openURL } = findByProps("openURL", "openDeeplink");
const { FormRow } = Forms;

const Icon = findByName("Icon") ?? findByProps("Sizes", "compare");
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const SearchIcon = <Icon source={getAssetIDByName("search")} />

const Navigation = findByProps("push", "pushLazy", "pop")
const modalCloseButton = findByProps("getRenderCloseButton")?.getRenderCloseButton ?? findByProps("getHeaderCloseButton")?.getHeaderCloseButton
const Navigator = findByName("Navigator") ?? findByProps("Navigator")?.Navigator


const listOfServices = {
	saucenao: {
		name: "SauceNAO",
		url: `https://saucenao.com/search.php?url=%s`,
		enabled: true,
	},
	tracemoe: {
		name: "trace.moe (Anime)",
		url: `https://trace.moe/?url=%s`,
		enabled: true,
	},
	iqdb: {
		name: "IQDB",
		url: `https://iqdb.org/?url=%s`,
		enabled: false,
	},
	imgops: {
		name: "ImgOps",
		url: `https://imgops.com/%s`,
		enabled: false,
	},
	tineye: {
		name: "TinEye",
		url: `https://tineye.com/search?url=%s`,
		enabled: false,
	},
	google: {
		name: "Google Images",
		url: `https://www.google.com/searchbyimage?image_url=%s&safe=off&sbisrc=cr_1_5_2`,
		enabled: false,
	},
	yandex: {
		name: "Yandex Images",
		url: `https://yandex.com/images/search?rpt=imageview&url=%s`,
		enabled: false,
	},
	fuzzysearch: {
		name: "FuzzySearch (FurAffinity, Twitter)",
		enabled: false,
		titlePage: "Fuzzysearch.net"
	}
};


makeDefaults(storage, {
	services: listOfServices,
	toggle: {
		removeTracking: false,
		encodeURL: false
	}
})

const patches = [];

export default {
	onLoad: () => {
		patches.push(
			before("openLazy", ActionSheet, ([component, key]) => {
				if (key !== "MediaShareActionSheet") return;
				component.then((instance) => {
					const unpatch = after("default", instance, ([{ syncer }], res) => {
						React.useEffect(() => unpatch(), []);

						let urlsource = syncer.sources[syncer.index.value];
						if(Array.isArray(urlsource)) urlsource = urlsource[0];

						const targetURL = urlsource.sourceURI ?? urlsource.uri;

						const buttonRows = res.props.children.props.children;

						if(buttonRows) {
							const filtered = Object.keys(listOfServices).filter((id) => storage.services[id].enabled);

							buttonRows.push(filtered.map((id) => {

								const onPress = () => {
									if(listOfServices[id].url) {
										let finalUrl = targetURL;

										if(storage?.toggle?.removeTracking) {
											const parsedCode = new URL(targetURL)
											finalUrl = `${parsedCode.origin}${parsedCode.pathname}`;
										}

										if(storage?.toggle?.encodeURL) {
											finalUrl = encodeURIComponent(finalUrl)
										}

										openURL(listOfServices[id].url.replace("%s", finalUrl))
									}
									else {										
										const navigator = () => (
											<Navigator
												initialRouteName="ServicePage"
												goBackOnBackPress
												screens={{
													ServicePage: {
														title: listOfServices[id].titlePage,
														headerLeft: modalCloseButton?.(() => Navigation.pop()),
														render: () => <FuzzySearchPage url={targetURL} />
													}
												}}
											/>
										)


				                        ActionSheet.hideActionSheet()
				                        Navigation.push(navigator)
									}

								}

								return (<>
									<FormRow
										leading={SearchIcon}
										label={listOfServices[id].name}
										onPress={onPress}
									/>							
								</>)
							}))
						}
					})
				})
			})
		)
	},
	onUnload: () => {		
		patches.forEach(un => un());
	},
	settings: SettingPage
}



/*

// Just for a bit of separation
export const onLoad = () => {
	storage.services ??= {};
	for (const [id, service] of Object.entries(services))
		storage.services[id] ??= service.default ?? false;
};

export const onUnload = before("openLazy", ActionSheet, ([component, key]) => {
	if (key !== "MediaShareActionSheet") return;
	component.then((instance) => {
		const unpatchInstance = after("default", instance, ([{ syncer }], res) => {
			React.useEffect(() => void unpatchInstance(), []);

			let source = syncer.sources[syncer.index.value];
				if (Array.isArray(source)) source = source[0];
					const url = source.sourceURI ?? source.uri;

      const rows = res.props.children.props.children; // findInReactTree?

      rows.push(...Object.keys(services).filter((id) => storage.services[id]).map((id) =>
      	<FormRow
      	leading={SearchIcon}
      	label={services[id].name}
      	onPress={() => openURL(services[id].url.replace("%s", url))}
      	/>
      	));
  });
			});
});

const { FormSection, FormDivider, FormRadioRow } = Forms;

export const settings = () => {
	useProxy(storage);

	return (
		<RN.ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
		<FormSection title="Services">
		<RN.FlatList
		data={Object.entries(storage.services)}
		ItemSeparatorComponent={FormDivider}
		renderItem={({ item: [id, enabled] }) =>
		<FormRadioRow
		label={services[id].name}
		selected={enabled}
		onPress={() => void (storage.services[id] = !storage.services[id])}
		/>
	}
	/>
	</FormSection>
	</RN.ScrollView>
	);
}
*/