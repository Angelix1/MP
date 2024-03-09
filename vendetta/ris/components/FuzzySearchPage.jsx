import { storage } from "@vendetta/plugin"
import { React, stylesheet } from "@vendetta/metro/common"
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components"
import { getData } from "../api/fuzzysearch";
import { FuzzySearchRow } from "./fsRow";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

const styles = stylesheet.createThemedStyleSheet({
	baseBg: {
		margin: 20, 
		padding: 25, 
		backgroundColor: "rgba(55, 149, 225, 0.3)"
	},
	bg: {
		borderRadius: 10,
		backgroundColor: "rgba(117, 227, 151, 0.35)"
	},
	border: {		
		borderRadius: 10,
	}
})

export default function FuzzySearchPage({ url }) {
	useProxy(storage)
	const [data, setData] = React.useState([])

	if(Array.isArray(data) && data?.length < 1) {
		const urx = new URL(url)
		// console.log(`${urx.origin}${urx.pathname}`)
		getData(`${urx.origin}${urx.pathname}`).then(datax => setData(datax))
	}

	return (<>
		<ScrollView>
			<View style={[styles.baseBg, styles.border]}>
				{
					(Array.isArray(data) && data.length < 1) && (<>
						<FormRow label="Loading..."/>
					</>)
				}
				{
					Array.isArray(data) ? data?.map((res, inx) => {
						return (<>
							<FuzzySearchRow data={res} />
							{inx == data.length - 1 ? undefined : <FormDivider />}
						</>)
					}) : (<>
						<FormRow label="Sorry, Couldn't find any results!" />
					</>)
				}
			</View>
		</ScrollView>
	</>)		
}