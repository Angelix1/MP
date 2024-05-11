import { storage } from "@vendetta/plugin"
import { showToast } from "@vendetta/ui/toasts"
import { NavigationNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findByProps } from "@vendetta/metro";
import { useProxy } from "@vendetta/storage";

import LogPage from "../pages/log";
import { UIElements } from "../../../lib/utility"

const dialog = findByProps("show", "confirm", "close");

const { FormRow } = UIElements

export default function LoggingComponent() {
	useProxy(storage)
	
	const navigation = NavigationNative.useNavigation();

	return (<>
		<FormRow
			label="Anti Edit & Delete Logs"
			leading={<FormRow.Icon source={getAssetIDByName("ic_audit_log_24px")} />}
			trailing={FormRow.Arrow}
			onPress={() =>
				navigation.push("VendettaCustomPage", {
					title: "Antied Logging Page",
					render: () => <LogPage/>,
				})
			}
		/>
		{
			(storage?.log?.length > 0) && (<>
				<FormRow
					label="Clear Logs"
					leading={<FormRow.Icon source={getAssetIDByName("ic_trash_24px")} />}
					trailing={FormRow.Arrow}
					onPress={() => {
						dialog.show({
							title: "Clear logs",
							body: "This will erase saved logs, continue?",
							confirmText: "Yes",
							cancelText: "No",
							confirmColor: "brand",
							onConfirm: () => {
								storage.log = [];
								showToast("[ANTIED] Logs cleared")
							}
						})
					}}
				/>
			</>)
		}
	</>)
}
