import { React, NavigationNative } from "@vendetta/metro/common";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets"

import CreditsPage from './components/credits';

const { FormRow } = Forms;

export default function SettingPage() {  
	useProxy(storage);

	const navigation = NavigationNative.useNavigation();

	const openCreditPage = () => {
		navigation.push("VendettaCustomPage", {
			title: `Credits & Support`,
			render: () => React.createElement(CreditsPage)
		})
	}

	return (<>
		<FormRow
			label="CREDITS"
			subLabel="See the people behind the plugin and ways to support its development."
			onPress={openCreditPage}
			trailing={<FormRow.Icon source={getAssetIDByName("ic_arrow_right")} />}
		/>
	</>)
}