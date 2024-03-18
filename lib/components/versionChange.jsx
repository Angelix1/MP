import { React, ReactNative, constants, stylesheet } from "@vendetta/metro/common"
import { semanticColors } from "@vendetta/ui";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { ErrorBoundary, Forms, General } from "@vendetta/ui/components"

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput } = Forms;

const current = getAssetIDByName("ic_radio_square_checked_24px");
const older = getAssetIDByName("ic_radio_square_24px")
const info = getAssetIDByName("ic_information_24px")
const infoAlt = getAssetIDByName("ic_info")

const newStuff = getAssetIDByName("premium_sparkles")
const updatedStuff = getAssetIDByName("ic_sync_24px")
const fixStuff = getAssetIDByName("ic_progress_wrench_24px")

const styles = stylesheet.createThemedStyleSheet({
	border: {
		borderRadius: 10 
	},
	textBody: {
		color: semanticColors.TEXT_NORMAL,
		fontFamily: constants.Fonts.PRIMARY_MEDIUM,
		letterSpacing: 0.25,
		fontSize: 22
	},
	textBody: {
      	color: semanticColors.INPUT_PLACEHOLDER_TEXT,
		fontFamily: constants.Fonts.DISPLAY_NORMAL,
		letterSpacing: 0.25,
		fontSize: 16
	},
	versionBG: {
		margin: 10, 
		padding: 15, 
		backgroundColor: "rgba(55, 149, 225, 0.3)"
	},
	rowLabel: { 
		margin: 10,
		padding: 15,
		backgroundColor: "rgba(33, 219, 222, 0.34)"
	}
})


function addIcon(icon) {
	return (<FormIcon style={{ opacity: 1 }} source={icon} />)
}

export default function VersionChange({ change, index, totalIndex }) {
	const [isOpen, setOpen] = React.useState(false)
	const [isRowOpen, setRowOpen] = React.useState(false)

	function createSubRow(arr, label, subLabel, icon) {
		return (
			<View>
				<FormRow
					label={label || "No Section"}
					subLabel={subLabel || null}
					leading={icon && addIcon(icon)}
					style={[styles.textHeader]}
				/>
				{
					arr.map((x, i) => {
						return(<>
							<FormRow label={x} style={[styles.textBody, styles.rowLabel, styles.border]} />
						</>)
					})
				}
			</View>
		)
	}


	return (<>
		<ErrorBoundary>
			<FormRow
				label={change?.version}
				leading={ (index == 0) ? addIcon(current) : addIcon(older) }
				trailing={ addIcon(info) }
				onPress={() => {
					setOpen(!isOpen)
				}}
			/>
			{
				isOpen && (
					<View style={[styles.versionBG, styles.border]}>
						{
							(change?.new?.length > 0) && createSubRow(
								change.new,
								"New", 
								"New stuffies",
								newStuff
							)
						}
						{
							(change?.updated?.length > 0) && createSubRow(
								change.updated,
								"Changes", 
								"Update things",
								updatedStuff
							)
						}
						{
							(change?.fix?.length > 0) && createSubRow(
								change.fix,
								"Fixes", 
								"Me hate borken things",
								fixStuff
							)
						}
					</View>
				)
			}
			{(index == totalIndex.length -1 ? undefined : <FormDivider/>)}
		</ErrorBoundary>
	</>)
}