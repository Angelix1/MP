import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { React } from "@vendetta/metro/common"
import { Forms, General } from "@vendetta/ui/components";
import { logger } from "@vendetta";

const { ScrollView, View, Text, TouchableOpacity, TextInput, Image, Animated } = General;
const { FormLabel, FormIcon, FormArrow, FormRow, FormSwitch, FormSwitchRow, FormSection, FormDivider, FormInput, FormRadioRow } = Forms;

export default function SpecificPerm({ perm, data }) {
	useProxy(storage)

	const [enable, setEnable] = React.useState(data?.permissions?.includes(perm))

	return (<>
		<FormRadioRow
			label={perm}
			selected={enable || false}
			onPress={() => {

				if(storage?.toggle?.debug) logger.log(data?.name, "Perm Change", data?.permissions);

				if(enable) {
					data.permissions = data.permissions.filter(pp => pp != perm)
					setEnable(false)
				}
				else {
					data.permissions.push(perm)
					setEnable(true)
				}
			}}
		/>
	</>)
}