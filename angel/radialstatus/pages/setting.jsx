import { findByProps } from "@vendetta/metro";
import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { Forms } from "@vendetta/ui/components";

const { ScrollView, View, Text, TextInput, Animated, Easing, Pressable } = ReactNative;
const { useState, useEffect, useRef } = React;
const { FormSection, FormDivider, FormRow } = Forms;

const { openAlert } = findByProps("openAlert", "dismissAlert");
const { AlertModal, AlertActions, AlertActionButton } = findByProps("AlertModal", "AlertActions", "AlertActionButton");

export default () => {
	useProxy(storage);
	const [colors, setColors] = useState(storage.colors || {
		online: "#3BA55C",
		idle: "#FAA81A",
		dnd: "#ED4245",
	});

	const [mult, setMult] = useState(storage.mult || 1.2);
	const [size, setSize] = useState(storage.size || 30);

	
	const hue = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.loop(
			Animated.timing(hue, {
				toValue: 1,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: false,
			})
		).start();
	}, []);

	const headerColor = hue.interpolate({
		inputRange: [0, 1],
		outputRange: ["#ff0000", "#ff0000"], // will be rotated by hue
	});

	const updateColor = (key, val) => {
		const next = { ...colors, [key]: val };
		setColors(next);
		storage.colors = next;
	};

	const Ring = ({ status, color }) => (
		<View style={{
			width: 48, height: 48, borderRadius: 24,
			backgroundColor: "#1E1E1E", margin: 8,
			justifyContent: "center", alignItems: "center",
		}}>
			<View style={{
				width: 44, height: 44, borderRadius: 22,
				borderWidth: 4, borderColor: color,
			}} />
			<Text style={{ color: "#fff", fontSize: 10, marginTop: 4 }}>{status}</Text>
		</View>
	);

	const thing = "I'm toooooo lazy to finish this plugin, so deal with it.";

	const keyDict = {
		"online": "Online",
		"idle": "Idle",
		"dnd": "Do Not Disturb",
	}

	const randomHex = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

	return (
		<ScrollView style={{ backgroundColor: "#111" }}>		
			<Animated.View style={{
				paddingVertical: 40, alignItems: "center",
				backgroundColor: headerColor,
			}}>
				<Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff" }}>Presence Ring</Text>
				<Text style={{ fontSize: 14, color: "#eee", marginTop: 4 }}>Customise indicator colors</Text>
			</Animated.View>

			<FormSection title="Live preview">
				<View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingVertical: 16 }}>
					<Ring status="Online" color={colors.online} />
					<Ring status="Idle"   color={colors.idle} />
					<Ring status="DND"    color={colors.dnd} />
				</View>
			</FormSection>

			<FormSection title="Colour palette">
				<View style={{ marginHorizontal: 16, marginVertical: 8 }}>
				{
					Object.entries(colors).map(([key, value]) => (
						<>
							<Text style={{ color: "#fff", fontSize: 16, marginBottom: 4 }}>
								{keyDict[key]}
							</Text>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<TextInput
									style={{
										flex: 1, backgroundColor: "#222", color: "#fff",
										borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
										fontFamily: "monospace", fontSize: 14,
										borderWidth: 2, borderColor: value,
									}}
									value={value}
									onChangeText={v => updateColor(key, v)}
									placeholder="#RRGGBB"
								/>
								<View style={{
									width: 32, height: 32, borderRadius: 16,
									backgroundColor: value, marginLeft: 12,
									borderWidth: 3, borderColor: "#444",
								}} />
							</View>
						</>
				))}
				{/*
						<View style={{ flexDirection: "row", alignItems: "center" }}>
						<TextInput
							style={{
								flex: 1, backgroundColor: "#222", color: "#fff",
								borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
								fontFamily: "monospace", fontSize: 14,
								borderWidth: 2, borderColor: randomHex(),
							}}
							value={mult}
							onChangeText={v => {
								setMult(v)
								storage.mult = v;
							}}
							placeholder="1.2"
						/>
					</View>

					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<TextInput
							style={{
								flex: 1, backgroundColor: "#222", color: "#fff",
								borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
								fontFamily: "monospace", fontSize: 14,
								borderWidth: 2, borderColor: randomHex(),
							}}
							value={size}
							onChangeText={v => {
								setSize(v)
								storage.size = v;
							}}
							placeholder="30"
						/>
					</View> 
				*/}
				</View>
			</FormSection>

			<FormSection title="Wild extras">
				<View style={{
					margin: 16, padding: 20,
					backgroundColor: "#252525", borderRadius: 12,
					borderWidth: 2, borderColor: "#5865F2",
				}}>
					<FormRow
						label="Click to Randomize the color palette"
						style={{ color: "#aaa", fontSize: 12, textAlign: "center", marginTop: 8 }}
						onPress={() => {

							openAlert("rainbomizer",
								(<>
									<AlertModal
										title="Note"
										content={<Text variant="text-md/semibold" color="TEXT_NORMAL">{thing}</Text>}
										actions={
											<AlertActions>
												<AlertActionButton text="OK" variant="primary"/>
											</AlertActions>
										}
									/>
								</>)
							);
						}}
					/>
				</View>
			</FormSection>
			<View style={{ paddingBottom: "50vh" }}/> 
		</ScrollView>
	);
};