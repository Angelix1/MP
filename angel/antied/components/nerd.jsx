import { useProxy } from "@vendetta/storage"
import { storage } from "@vendetta/plugin"
import { SelectRow } from "../lib/SelectRow"
import { Forms } from "@vendetta/ui/components"
import { plugin } from "@vendetta";
import { findByName } from "@vendetta/metro";
import { showToast } from "@vendetta/ui/toasts";

const HelpMessage = findByName("HelpMessage");

const { FormRow, FormDivider, FormInput, FormSwitch } = Forms


export default function NerdComponent({ stx }) {
	useProxy(storage)

	const [plugUri, setPlugUri] = React.useState(plugin.id)
	
	return (<>
		<HelpMessage messageType={0}>Changing the plugin URL may redirect future updates to the new source, or prevent updates entirely.</HelpMessage>
		<FormInput
			title="Change Plugin URL"
			keyboardType="default"
			placeholder="https://angelix1.github.io/MP/angel/antied"
			value={plugUri}
			onChange={(val) => {
				plugin.id = val?.toString()
				setPlugUri(val?.toString())
			}}
		/>
		<FormDivider />
		<FormRow
			label="Restore original URL"
			subLabel="Click to switch to the production build URL (will exit debug version)"
			onPress={() => {
				plugin.id = "https://angelix1.github.io/MP/angel/antied";
				showToast("Plugin URL source restored to original URL.")
			}}
		/>
		<FormDivider />
		<FormRow
			label="Restore original plugin name"
			subLabel="Click to reset to the default name"
			onPress={() => {
				plugin.manifest.name = plugin.manifest.originalName;
				showToast("Plugin Name restored to original name.")
			}}
		/>
		<FormDivider />
		<FormRow
			label="Debug"
			subLabel="Enable general console logging"
			style={{ paddingBottom: 20 }}
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
		<FormRow
			label="Debug updateRows"
			subLabel="Enable updateRows console logging"
			style={{ paddingBottom: 20 }}
			trailing={
				<FormSwitch
					value={storage.debugUpdateRows}
					onValueChange={(value) => {
						storage.debugUpdateRows = value
					}}
				/>
			}
		/>
	</>)
}
