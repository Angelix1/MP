import { storage } from "@vendetta/plugin"
import { useProxy } from "@vendetta/storage"
import { rawColors, semanticColors } from "@vendetta/ui"

import { UIElements } from "../../../lib/utility"
import { SelectRow } from "../lib/SelectRow"


const SC = Object.keys(semanticColors).map(x => `semanticColors.${x}`)
const RC = Object.keys(rawColors).map(x => `rawColors.${x}`)

const semRaw = [...SC, ...RC]

const { FormRow, FormDivider, ScrollView } = UIElements


export default function SemRawComponent() {
	useProxy(storage)
	
	return (<>
		<ScrollView>
			<FormRow label="Choose Color"/>
			{
				semRaw.map((NAME, i) => {
					return (<>
						<SelectRow 
							label={NAME} 
							selected={storage.colors.semRawColorPrefix == NAME} 
							onPress={() => storage.colors.semRawColorPrefix = NAME} 
						/>
						{i !== semRaw.length - 1 && <FormDivider />}
					</>)
				})
			}
		</ScrollView>
	</>)
}

