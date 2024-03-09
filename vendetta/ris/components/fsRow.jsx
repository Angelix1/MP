import { findByProps } from "@vendetta/metro";
import { React, ReactNative, constants, stylesheet } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { ErrorBoundary, Forms, General } from "@vendetta/ui/components"

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

const { openURL } = findByProps("openURL", "openDeeplink");

const styles = stylesheet.createThemedStyleSheet({
	bg: {
		borderRadius: 10,
		padding: 10,
		margin: 6,
		backgroundColor: "rgba(87, 187, 131, 0.25)"
	}
})

export function FuzzySearchRow({ data }) {
	const sites = {
		"furaffinity": "https://www.furaffinity.net/view/",
		"e621": "https://e621.net/posts/",
		"weasyl": "https://www.weasyl.com/view/",
	}



	return (<>
		<FormRow
			label={data?.site}
			subLabel={`Uploaded/Created by ${data?.artists?.[0]}`}
			trailing={<FormArrow />}			
			style={[styles.bg]}
			onPress={() => {
				if(data?.site?.toLowerCase?.() == "twitter") {
					openURL(`https://twitter.com/${data.artists?.[0]}/status/${data?.site_id_str}`)
				} 
				else {
					openURL(`${sites[data?.site?.toLowerCase?.()]}${data?.site_id || data?.site_id_str}`)
				}
			}}
		/>
	</>)
}