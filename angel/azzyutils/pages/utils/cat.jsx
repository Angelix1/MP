import { storage } from "@vendetta/plugin"
import { Forms } from "@vendetta/ui/components"


const { FormInput } = Forms

export default function CAT() {
	
	return (<>
		<FormInput
			title="Name"
			keyboardType="default"
			placeholder="Angel"
			value={storage?.utils?.cactus?.name}
			onChange={(val) => (storage.utils.cactus.name = val.toString())}
		/>
	</>)
}
