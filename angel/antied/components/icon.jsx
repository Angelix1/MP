import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"

import { UIElements } from "../../../lib/utility"
import { SelectRow } from "../lib/SelectRow"
import { vendettaUiAssets } from ".."

const { FormRow, FormDivider, ScrollView } = UIElements


export default function SemRawComponent() {
	useProxy(storage)
	
	return (<>
			<FormRow
				label="Remove Message Edit History Toast"
				subLabel="you can change the icon here"
				leading={<FormRow.Icon source={getAssetIDByName("ic_audit_log_24px")} />}
				trailing={FormRow.Arrow}
				onPress={() =>
					navigation.push("VendettaCustomPage", {
						title: "Semantic & Raw Colors",
						render: () => <>
							<FormRow label="Choose Icon"/>
							{
								vendettaUiAssets.map((NAME, i) => {
									return (<>
										<SelectRow 
											label={NAME} 
											selected={storage?.misc?.editHistoryIcon == NAME} 
											onPress={() => storage.misc.editHistoryIcon = NAME} 
										/>
										{i !== vendettaUiAssets.length - 1 && <FormDivider />}
									</>)
								})
							}
						</>,
					})
				}
			/>
	</>)
}

