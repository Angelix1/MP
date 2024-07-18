import { constants, React, ReactNative, stylesheet } from "@vendetta/metro/common";
import { findByName } from '@vendetta/metro';
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { semanticColors } from "@vendetta/ui";


import PatchesComponent from './components/patches';
import TextComponent from './components/texts';
import TimestampComponent from './components/timestamp';
import ColorPickComponent from './components/colorpick';
import IgnoreListComponent from './components/ignorelist';
import CustomizationComponent from './components/customize';

import { UIElements } from '../../lib/utility';
import updates from "./update";
import VersionChange from "../../lib/components/versionChange";

const { FormSwitch, FormSection, FormRow, ScrollView, View, FormDivider, Animated } = UIElements;

const LinearGradient = findByName("LinearGradient");
const styles = stylesheet.createThemedStyleSheet({
	text: {
		color: semanticColors.HEADER_SECONDARY,
		paddingLeft: "5.5%",
		paddingRight: 10,
		marginBottom: 10,
		letterSpacing: 0.25,
		fontFamily: constants.Fonts.PRIMARY_BOLD,
		fontSize: 16
	},
	subText: {
		color: semanticColors.TEXT_POSITIVE,
		paddingLeft: "6%",
		paddingRight: 10,
		marginBottom: 10,
		letterSpacing: 0.25,
		fontFamily: constants.Fonts.DISPLAY_NORMAL,
		fontSize: 12    
	},
	input: {
		fontSize: 16,
		fontFamily: constants.Fonts.PRIMARY_MEDIUM,
		color: semanticColors.TEXT_NORMAL
	},
	placeholder: {
		color: semanticColors.INPUT_PLACEHOLDER_TEXT
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorPreview: {
		width: "75%",
		height: 100,
		marginBottom: 20,
	},
	row: {
		flexDirection: "row", 
		height: 80,
		width: "90%", 
		marginBottom: 20
	},
	border: {
		borderRadius: 12
	},	
	lnBorder: {
		borderRadius: 12,
		overflow: "hidden"
	},
	shadowTemplate: {
		shadowOffset: {
			width: 1,
			height: 3,
		},
		shadowOpacity: 0.9,
		shadowRadius: 24.00,
		elevation: 16,
	},
	lnShadow: { 
		flex: 1,
		margin: "1%",
		shadowColor: "#b8ff34"
	},
	darkMask: {
		backgroundColor: "rgba(10, 10, 10, 0.9)",
		margin: 2,
		padding: "3%"
	},
	padBot: {
		paddingBottom: 20
	}
});

export default function SettingPage() {  
	useProxy(storage);

	const [animation] = React.useState(new Animated.Value(0));

	React.useEffect(() => {
		Animated.loop(
			Animated.timing(
				animation,
				{
					toValue: 4,
					duration: 8000,
					useNativeDriver: true,
				}
			)
		).start();
	}, []);

	const bgStyle = {
		backgroundColor: animation.interpolate({
			inputRange: [0, 1, 2, 3, 4],
			outputRange: [
				"rgba(188,31,31,0.5)",
				"rgba(46,168,30,0.5)",
				"rgba(48,179,173,0.5)",
				"rgba(183,40,198,0.5)",
				"rgba(188,31,31,0.5)",
			],
		}),
	};

	const createChild = (id, title, label, subLabel, props, propsData) => { 
		return { id, title, label, subLabel, props, propsData }
	}

	const ComponentChildren = [
		createChild("patches", "Plugin Patcher", "Show Patches", "Toggle what the plugin patch", PatchesComponent, styles),
		createChild("customize", "Customization", "Customize", null, CustomizationComponent, styles),
		createChild("text", "Text Variables", "Customize Texts", null, TextComponent, styles),
		createChild("timestamp", "Timestamp", "Timestamp Styles", null, TimestampComponent, styles),
		createChild("colorpick", "Colors", "Customize Colors", null, ColorPickComponent, styles),
		createChild("ingorelist", "Ignore List", "Show IngoreList", null, IgnoreListComponent, null),
	]

	const currentOS = ReactNative?.Platform?.OS || null;

	const entireUIList = (<>
		<View style={[ styles.lnBorder, bgStyle, styles.darkMask ]}>
			{
				ComponentChildren.map((element) => {				
					return (<>
						<FormSection title={element?.title}>
							<FormRow
								label={element?.label}
								subLabel={element?.subLabel}
								trailing={
									<FormSwitch
										value={storage.setting[element?.id]}
										onValueChange={(value) => {
											storage.setting[element?.id] = value
										}}
									/>
								}
							/>
							{
								storage.setting[element.id] && 
								element.props && (
									<View style={{ 
										margin: 5, 
										padding: 10, 
										borderRadius: 10, 
										backgroundColor: "rgba(0, 0, 0, 0.15)"
									}}>
										{React.createElement(element.props, { styles: element.propsData })}
									</View>
								)
							}
						</FormSection>
					</>)
				})
			}
			<FormDivider />
			<FormRow
				label="Debug"
				subLabel="Enable console logging"
				style={[styles.padBot]}
				trailing={
					<FormSwitch
						value={storage.debug}
						onValueChange={(value) => {
							storage.debug = value
						}}
					/>
				}
			/>
			<FormDivider />
			{
				updates && (
					<FormSection title="Updates">
						<View style={{ 
							margin: 5, 
							padding: 5,
							borderRadius: 10,
							backgroundColor: "rgba(59, 30, 55, 0.15)"
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
		</View>
	</>)

	return (<>
		<ScrollView>
			{
				(currentOS == "android") ? 
					(<>					
						<LinearGradient 
							start={{x: 0.8, y: 0}}
							end={{x: 0, y: 0.8}}
							colors={[ "#b8ff34", "#4bff61", "#44f6ff", "#4dafff", "#413dff", "#d63efd" ]}
							style={[ styles.lnBorder, styles.shadowTemplate, styles.lnShadow, styles.padBot ]}
						>
							{entireUIList}	
						</LinearGradient>
					</>) :
					(entireUIList)
			}
		</ScrollView>
	</>)
}