import { plugin } from "@vendetta";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";

import { patchSettingsPin } from "./pinToSetting";

import Settings from "../Settings";
import SettingsSection from "./settingAddon";

import Log from "../pages/log";
import LogSection from "./logAddon";

export default (): (() => void) => {
	const patches = [];
	const stripVersions = (str: string): string => str.replace(/\s?v\d+.\d+.\w+/, "");

	const pluginName: string = plugin?.manifest?.name;
	
	const name_1: string = (pluginName) ? `${stripVersions(pluginName)} Settings` : "Anti Edit & Delete Settings";
	const name_2: string = (pluginName) ? `${stripVersions(pluginName)} Logs` : "Anti Edit & Delete Logs";

	patches.push(
		patchSettingsPin(
			() => true,
			() => <SettingsSection />,
			{
				key: "antied_setting",
				icon: getAssetIDByName("ic_edit_24px"),
				title: name_1,
				page: {
					title: name_1,
					render: Settings,
				},
			},
		),
		patchSettingsPin(
			() => true,
			() => <LogSection />,
			{
				key: "antied_logs",
				icon: getAssetIDByName("ic_message_delete"),
				title: name_2,
				page: {
					title: name_2,
					render: Log,
				},
			},
		)
	)

	return () => patches.forEach((x) => x());
};